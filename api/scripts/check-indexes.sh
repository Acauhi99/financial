#!/bin/bash

echo "🔍 Checking MongoDB Indexes..."

# Check if MongoDB is running
if ! docker ps | grep -q financial-mongodb; then
    echo "❌ MongoDB container not running. Start with: docker compose up -d mongodb"
    exit 1
fi

echo "📊 Transactions Collection Indexes:"
docker exec financial-mongodb mongosh --quiet --eval "
    use financial;
    db.transactions.getIndexes().forEach(function(index) {
        print('- ' + JSON.stringify(index.key) + ' (' + index.name + ')');
    });
"

echo ""
echo "💰 Investments Collection Indexes:"
docker exec financial-mongodb mongosh --quiet --eval "
    use financial;
    db.investments.getIndexes().forEach(function(index) {
        print('- ' + JSON.stringify(index.key) + ' (' + index.name + ')');
    });
"

echo ""
echo "📂 Categories Collection Indexes:"
docker exec financial-mongodb mongosh --quiet --eval "
    use financial;
    db.categories.getIndexes().forEach(function(index) {
        print('- ' + JSON.stringify(index.key) + ' (' + index.name + ')');
    });
"

echo ""
echo "📈 Collection Stats:"
docker exec financial-mongodb mongosh --quiet --eval "
    use financial;
    print('Transactions: ' + db.transactions.countDocuments());
    print('Investments: ' + db.investments.countDocuments());
    print('Categories: ' + db.categories.countDocuments());
"