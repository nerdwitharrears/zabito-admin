const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/dashboard',  require('./routes/dashboard'));
app.use('/api/hostels',    require('./routes/hostels'));
app.use('/api/rooms',      require('./routes/rooms'));
app.use('/api/beds',       require('./routes/beds'));
app.use('/api/tenants',    require('./routes/tenants'));
app.use('/api/expenses',   require('./routes/expenses'));
app.use('/api/investments', require('./routes/investments'));
app.use('/api/rent',       require('./routes/rent'));

app.listen(PORT, () => {
  console.log(`Zabito server running on http://localhost:${PORT}`);
});
