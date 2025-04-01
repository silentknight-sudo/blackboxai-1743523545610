from app import app, db, Product, User, Order, OrderItem
from werkzeug.security import generate_password_hash

def init_database():
    with app.app_context():
        # Drop all existing tables
        db.drop_all()
        
        # Create all tables
        db.create_all()

        # Add sample products
        products = [
            {
                'name': 'Luxury Satin Scrunchie Set',
                'description': 'Set of 3 silky smooth satin scrunchies in pastel shades',
                'price': 1199.00,
                'category': 'scrunchies',
                'image_url': 'https://images.pexels.com/photos/1687719/pexels-photo-1687719.jpeg',
                'stock': 50
            },
            {
                'name': 'Premium Velvet Scrunchie Collection',
                'description': 'Set of 4 luxurious velvet scrunchies in jewel tones',
                'price': 1349.00,
                'category': 'scrunchies',
                'image_url': 'https://images.pexels.com/photos/1805416/pexels-photo-1805416.jpeg',
                'stock': 45
            },
            {
                'name': 'Deluxe Birthday Celebration Hamper',
                'description': 'Includes scrunchies, hair clips, and personalized accessories',
                'price': 4499.00,
                'category': 'hampers',
                'image_url': 'https://images.pexels.com/photos/1574282/pexels-photo-1574282.jpeg',
                'stock': 20
            },
            {
                'name': 'Self Care Gift Box',
                'description': 'Curated collection of hair accessories and beauty items',
                'price': 3499.00,
                'category': 'hampers',
                'image_url': 'https://images.pexels.com/photos/1661471/pexels-photo-1661471.jpeg',
                'stock': 25
            },
            {
                'name': 'Elegant Wedding Favor Set',
                'description': 'Set of 5 matching hair accessories in gift packaging',
                'price': 2499.00,
                'category': 'return-gifts',
                'image_url': 'https://images.pexels.com/photos/1670770/pexels-photo-1670770.jpeg',
                'stock': 30
            },
            {
                'name': 'Party Favor Collection',
                'description': 'Customizable party favors with trendy accessories',
                'price': 2199.00,
                'category': 'return-gifts',
                'image_url': 'https://images.pexels.com/photos/1721944/pexels-photo-1721944.jpeg',
                'stock': 35
            },
            {
                'name': 'Vintage Pearl Hair Clip Set',
                'description': 'Set of 6 elegant pearl-embellished hair clips',
                'price': 1699.00,
                'category': 'accessories',
                'image_url': 'https://images.pexels.com/photos/1724888/pexels-photo-1724888.jpeg',
                'stock': 40
            },
            {
                'name': 'Designer Hair Bow Collection',
                'description': 'Set of 4 handcrafted satin bows with crystal details',
                'price': 1949.00,
                'category': 'accessories',
                'image_url': 'https://images.pexels.com/photos/1724887/pexels-photo-1724887.jpeg',
                'stock': 38
            }
        ]

        # Add products to database
        for product_data in products:
            product = Product(**product_data)
            db.session.add(product)

        # Create admin user
        admin = User(
            name='Admin',
            email='admin@allthatglitters.com',
            password=generate_password_hash('admin123'),
            is_admin=True
        )
        db.session.add(admin)

        # Create sample user
        user = User(
            name='Sample User',
            email='user@example.com',
            password=generate_password_hash('user123'),
            is_admin=False
        )
        db.session.add(user)

        # Commit all changes
        db.session.commit()
        print("Database initialized successfully!")

if __name__ == '__main__':
    init_database()