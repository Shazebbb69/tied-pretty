import requests
import sys
import json
from datetime import datetime

class TPLoveCoAPITester:
    def __init__(self, base_url="https://craft-corner-23.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_token = None

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.admin_token:
            headers['Authorization'] = f'Bearer {self.admin_token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(response_data) <= 3:
                        print(f"   Response: {response_data}")
                    elif isinstance(response_data, list) and len(response_data) <= 2:
                        print(f"   Response: {len(response_data)} items")
                except:
                    pass
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text[:200]}")

            return success, response.json() if response.content else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_endpoints(self):
        """Test basic health endpoints"""
        print("\n" + "="*50)
        print("TESTING HEALTH ENDPOINTS")
        print("="*50)
        
        self.run_test("API Root", "GET", "api/", 200)
        self.run_test("Health Check", "GET", "api/health", 200)

    def test_categories(self):
        """Test categories endpoint"""
        print("\n" + "="*50)
        print("TESTING CATEGORIES")
        print("="*50)
        
        success, categories = self.run_test("Get Categories", "GET", "api/categories", 200)
        if success and categories:
            print(f"   Found {len(categories)} categories:")
            for cat in categories[:3]:  # Show first 3
                print(f"   - {cat.get('name', 'Unknown')} ({cat.get('slug', 'no-slug')})")
            
            # Verify all 7 expected categories exist
            expected_categories = ['hamper', 'bouquet', 'keychain', 'hair-accessories', 'plushie', 'custom-album', 'custom-embroidery']
            found_slugs = [cat.get('slug') for cat in categories]
            missing = [slug for slug in expected_categories if slug not in found_slugs]
            if missing:
                print(f"   ⚠️  Missing categories: {missing}")
            else:
                print(f"   ✅ All 7 expected categories found")
        
        return success, categories

    def test_products(self):
        """Test products endpoints"""
        print("\n" + "="*50)
        print("TESTING PRODUCTS")
        print("="*50)
        
        # Test get all products
        success, products = self.run_test("Get All Products", "GET", "api/products", 200)
        if success and products:
            print(f"   Found {len(products)} products")
            
            # Test category filtering
            if products:
                first_product_category = products[0].get('category')
                if first_product_category:
                    self.run_test(f"Filter by Category ({first_product_category})", 
                                "GET", f"api/products?category={first_product_category}", 200)
                
                # Test search
                first_product_name = products[0].get('name', '').split()[0]
                if first_product_name:
                    self.run_test(f"Search Products ({first_product_name})", 
                                "GET", f"api/products?search={first_product_name}", 200)
                
                # Test get single product
                first_product_id = products[0].get('id')
                if first_product_id:
                    self.run_test("Get Single Product", 
                                "GET", f"api/products/{first_product_id}", 200)
        
        return success, products

    def test_admin_auth(self):
        """Test admin authentication"""
        print("\n" + "="*50)
        print("TESTING ADMIN AUTHENTICATION")
        print("="*50)
        
        # Test login with correct credentials
        login_data = {
            "email": "admin@tploveco.com",
            "password": "admin123"
        }
        
        success, response = self.run_test("Admin Login", "POST", "api/auth/login", 200, login_data)
        if success and response:
            self.admin_token = response.get('access_token')
            print(f"   ✅ Admin token obtained")
            
            # Test get current user
            self.run_test("Get Current User", "GET", "api/auth/me", 200, auth_required=True)
        else:
            print(f"   ❌ Failed to get admin token")
        
        # Test login with wrong credentials
        wrong_login = {
            "email": "admin@tploveco.com",
            "password": "wrongpassword"
        }
        self.run_test("Wrong Password", "POST", "api/auth/login", 401, wrong_login)
        
        return success

    def test_admin_product_crud(self):
        """Test admin product CRUD operations"""
        print("\n" + "="*50)
        print("TESTING ADMIN PRODUCT CRUD")
        print("="*50)
        
        if not self.admin_token:
            print("❌ No admin token available, skipping CRUD tests")
            return False
        
        # Create a test product
        test_product = {
            "name": "Test Product",
            "description": "A test product for API testing",
            "price": 299.99,
            "category": "keychain",
            "image_url": "https://example.com/test.jpg",
            "in_stock": True
        }
        
        success, created_product = self.run_test("Create Product", "POST", "api/products", 201, 
                                                test_product, auth_required=True)
        
        if success and created_product:
            product_id = created_product.get('id')
            print(f"   ✅ Created product with ID: {product_id}")
            
            # Update the product
            update_data = {
                "name": "Updated Test Product",
                "price": 399.99
            }
            self.run_test("Update Product", "PUT", f"api/products/{product_id}", 200, 
                         update_data, auth_required=True)
            
            # Delete the product
            self.run_test("Delete Product", "DELETE", f"api/products/{product_id}", 200, 
                         auth_required=True)
        
        # Test unauthorized access
        self.run_test("Unauthorized Create", "POST", "api/products", 401, test_product)
        
        return success

    def test_cors_and_security(self):
        """Test CORS and security headers"""
        print("\n" + "="*50)
        print("TESTING CORS & SECURITY")
        print("="*50)
        
        try:
            response = requests.get(f"{self.base_url}/api/health")
            headers = response.headers
            
            print(f"   CORS Headers:")
            cors_headers = ['Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials', 
                          'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers']
            for header in cors_headers:
                value = headers.get(header, 'Not set')
                print(f"   - {header}: {value}")
            
            # Check if credentials are allowed
            if headers.get('Access-Control-Allow-Credentials') == 'true':
                print(f"   ✅ CORS credentials enabled")
                self.tests_passed += 1
            else:
                print(f"   ⚠️  CORS credentials not enabled")
            
            self.tests_run += 1
            
        except Exception as e:
            print(f"   ❌ Error checking CORS: {e}")

def main():
    print("🚀 Starting TP LoveCo API Tests")
    print("="*60)
    
    tester = TPLoveCoAPITester()
    
    # Run all tests
    tester.test_health_endpoints()
    tester.test_categories()
    tester.test_products()
    tester.test_admin_auth()
    tester.test_admin_product_crud()
    tester.test_cors_and_security()
    
    # Print final results
    print("\n" + "="*60)
    print("📊 FINAL TEST RESULTS")
    print("="*60)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())