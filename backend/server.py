from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from bson import ObjectId
import secrets
import base64

ROOT_DIR = Path(__file__).parent

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get("JWT_SECRET", secrets.token_hex(32))
JWT_ALGORITHM = "HS256"

# Create the main app
app = FastAPI(title="tiedprettyy API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: str
    in_stock: bool = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    in_stock: Optional[bool] = None

class ProductResponse(BaseModel):
    id: str
    name: str
    description: str
    price: float
    category: str
    image_url: str
    in_stock: bool
    created_at: str

class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    image_url: str

# ==================== PASSWORD HELPERS ====================

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

# ==================== JWT HELPERS ====================

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=60),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["name"],
            "role": user.get("role", "user")
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def require_admin(request: Request) -> dict:
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/login")
async def login(data: UserLogin, response: Response):
    email = data.email.lower().strip()
    user = await db.users.find_one({"email": email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return {
        "id": user_id,
        "email": user["email"],
        "name": user["name"],
        "role": user.get("role", "user"),
        "access_token": access_token
    }

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return user

# ==================== PRODUCT ROUTES ====================

@api_router.get("/products", response_model=List[ProductResponse])
async def get_products(category: Optional[str] = None, search: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    return products

@api_router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.post("/products", response_model=ProductResponse)
async def create_product(product: ProductCreate, request: Request):
    await require_admin(request)
    
    product_dict = product.model_dump()
    product_dict["id"] = str(uuid.uuid4())
    product_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.products.insert_one(product_dict)
    return product_dict

@api_router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, product: ProductUpdate, request: Request):
    await require_admin(request)
    
    existing = await db.products.find_one({"id": product_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = {k: v for k, v in product.model_dump().items() if v is not None}
    if update_data:
        await db.products.update_one({"id": product_id}, {"$set": update_data})
    
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    return updated

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, request: Request):
    await require_admin(request)
    
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

# ==================== CATEGORY ROUTES ====================

@api_router.get("/categories", response_model=List[CategoryResponse])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).to_list(100)
    return categories

# ==================== HEALTH CHECK ====================

@api_router.get("/")
async def root():
    return {"message": "tiedprettyy API is running"}

@api_router.get("/health")
async def health():
    return {"status": "healthy"}

# Include the router in the main app
app.include_router(api_router)

# CORS configuration
frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[frontend_url, "http://localhost:3000", "https://craft-corner-23.preview.emergentagent.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== STARTUP / SHUTDOWN ====================

@app.on_event("startup")
async def startup_event():
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.products.create_index("category")
    await db.products.create_index("id", unique=True)
    await db.categories.create_index("slug", unique=True)
    
    # Seed admin user
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@tploveco.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    
    existing_admin = await db.users.find_one({"email": admin_email})
    if not existing_admin:
        admin_user = {
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_user)
        logger.info(f"Admin user created: {admin_email}")
    else:
        # Update password if changed
        if not verify_password(admin_password, existing_admin["password_hash"]):
            await db.users.update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_password)}}
            )
            logger.info("Admin password updated")
    
    # Seed categories
    categories = [
        {"id": str(uuid.uuid4()), "name": "Hamper", "slug": "hamper", "image_url": "https://images.unsplash.com/photo-1508899203029-1c9eb493c9bd?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"},
        {"id": str(uuid.uuid4()), "name": "Bouquet", "slug": "bouquet", "image_url": "https://images.pexels.com/photos/879198/pexels-photo-879198.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
        {"id": str(uuid.uuid4()), "name": "Keychain", "slug": "keychain", "image_url": "https://images.pexels.com/photos/35101964/pexels-photo-35101964.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
        {"id": str(uuid.uuid4()), "name": "Hair Accessories", "slug": "hair-accessories", "image_url": "https://images.pexels.com/photos/5642831/pexels-photo-5642831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
        {"id": str(uuid.uuid4()), "name": "Plushie", "slug": "plushie", "image_url": "https://images.unsplash.com/photo-1753370241593-9cc8c17d7434?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"},
        {"id": str(uuid.uuid4()), "name": "Custom Album", "slug": "custom-album", "image_url": "https://images.unsplash.com/photo-1706931333738-87738429e35b?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"},
        {"id": str(uuid.uuid4()), "name": "Custom Embroidery", "slug": "custom-embroidery", "image_url": "https://images.pexels.com/photos/35360708/pexels-photo-35360708.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
    ]
    
    for cat in categories:
        existing = await db.categories.find_one({"slug": cat["slug"]})
        if not existing:
            await db.categories.insert_one(cat)
            logger.info(f"Category created: {cat['name']}")
    
    # Seed sample products
    sample_products = [
        {"id": str(uuid.uuid4()), "name": "Crochet Flower Bouquet", "description": "Beautiful handmade crochet flower bouquet perfect for gifts", "price": 599, "category": "bouquet", "image_url": "https://images.pexels.com/photos/879198/pexels-photo-879198.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Cute Bear Keychain", "description": "Adorable handmade bear keychain for your keys or bag", "price": 149, "category": "keychain", "image_url": "https://images.pexels.com/photos/35101964/pexels-photo-35101964.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Crochet Hair Clip Set", "description": "Set of 3 colorful crochet hair clips", "price": 199, "category": "hair-accessories", "image_url": "https://images.pexels.com/photos/5642831/pexels-photo-5642831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Bunny Plushie", "description": "Soft and cuddly handmade bunny plushie", "price": 799, "category": "plushie", "image_url": "https://images.unsplash.com/photo-1753370241593-9cc8c17d7434?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Gift Hamper Deluxe", "description": "Premium gift hamper with assorted handmade items", "price": 1499, "category": "hamper", "image_url": "https://images.unsplash.com/photo-1508899203029-1c9eb493c9bd?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Custom Photo Album", "description": "Personalized photo album with handmade decorations", "price": 999, "category": "custom-album", "image_url": "https://images.unsplash.com/photo-1706931333738-87738429e35b?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Embroidered Handkerchief", "description": "Custom embroidery on premium cotton handkerchief", "price": 349, "category": "custom-embroidery", "image_url": "https://images.pexels.com/photos/35360708/pexels-photo-35360708.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "in_stock": True, "created_at": datetime.now(timezone.utc).isoformat()},
    ]
    
    for prod in sample_products:
        existing = await db.products.find_one({"name": prod["name"]})
        if not existing:
            await db.products.insert_one(prod)
            logger.info(f"Product created: {prod['name']}")
    
    # Write test credentials
    os.makedirs("/app/memory", exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write(f"# Test Credentials\n\n")
        f.write(f"## Admin Account\n")
        f.write(f"- Email: {admin_email}\n")
        f.write(f"- Password: {admin_password}\n")
        f.write(f"- Role: admin\n\n")
        f.write(f"## Auth Endpoints\n")
        f.write(f"- POST /api/auth/login\n")
        f.write(f"- POST /api/auth/logout\n")
        f.write(f"- GET /api/auth/me\n")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
