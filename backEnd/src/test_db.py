from sqlalchemy import create_engine, text

DATABASE_URL = "mysql+mysqlconnector://root:3184@localhost:3306/authentication"

try:
    engine = create_engine(DATABASE_URL)
    connection = engine.connect()
    print("✅ Connected to MySQL successfully!")

    # Run query
    result = connection.execute(text("SELECT * FROM user"))
    for row in result:
        print(row)

    connection.close()
except Exception as e:
    print("❌ Connection failed")
    print(e)
