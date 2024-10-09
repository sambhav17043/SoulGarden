const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if(bar){
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if(close){
    close.addEventListener('click', () => {
        nav.classList.remove('active');   
    })
}

if(nav){
    nav.addEventListener('click', () => {
        nav.classList.remove('active');   
    })
}


// This script should be placed at the end of the body tag, or use the "defer" attribute in the script tag.

// JavaScript code for blog
document.getElementById('read-more-button-1').addEventListener('click', function() {
    toggleHiddenContent('hidden-content-1');
});

document.getElementById('read-button-2').addEventListener('click', function() {
    toggleHiddenContent('hidden-content-2');
});

function toggleHiddenContent(contentId) {
    const hiddenContent = document.getElementById(contentId);

    // Toggle the visibility of the hidden content
    if (hiddenContent.style.display === 'none' || hiddenContent.style.display === '') {
        hiddenContent.style.display = 'block';
    } else {
        hiddenContent.style.display = 'none';
    }
}

// Add 'active' class to #banner when the page loads
window.onload = function() {
    document.getElementById('banner').classList.add('active');
};

// Add 'active' class to #product1 when the page loads
window.onload = function() {
    document.getElementById('product1').classList.add('active');
};


// Configure MongoDB connection
const client = new MongoClient('mongodb://localhost:27018', { useNewUrlParser: true, useUnifiedTopology: true });
let db;

client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
    db = client.db('your-database-name'); // Replace with your actual database name
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Configure Nodemailer
const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

// Generate a random token
function generateToken() {
  return randomBytes(20).toString('hex');
}

// Send verification email
async function sendVerificationEmail(email, token) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Email Verification',
    html: `Click <a href="http://localhost:3000/verify/${token}">here</a> to verify your email.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// User registration route
app.post('/register', async (req, res) => {
  const { email } = req.body;

  const token = generateToken();
  const tokenExpiry = new Date();
  tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Token expires in 24 hours

  await db.collection('users').insertOne({ email, token, tokenExpiry, verified: false });

  await sendVerificationEmail(email, token);

  res.send('Check your email for verification instructions.');
});

// Token verification route
app.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  const user = await db.collection('users').findOne({ token });

  if (!user) {
    return res.status(400).send('Invalid or expired token.');
  }

  // Check if token is expired
  const currentTimestamp = new Date();
  const tokenExpired = currentTimestamp > user.tokenExpiry;

  if (tokenExpired) {
    return res.status(400).send('Token expired. Please request a new verification email.');
  }

  // Mark the user as verified
  await db.collection('users').updateOne({ _id: user._id }, { $set: { verified: true } });

  res.send('Email verified successfully.');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));







