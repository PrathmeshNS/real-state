# Deployment Guide for Render.com

This guide will help you deploy the Real Estate Chatbot to Render.com successfully.

## Issues Fixed for Production Deployment

### 1. Django Settings Updates
- ✅ Added proper `ALLOWED_HOSTS` configuration including Render domains
- ✅ Added environment-based `DEBUG` setting (False in production)
- ✅ Added WhiteNoise for static file serving in production
- ✅ Added proper CORS configuration for production
- ✅ Added security headers for production
- ✅ Added environment variable support for deployment

### 2. Dependencies Updated
- ✅ Added `whitenoise` to requirements.txt for static file handling

### 3. Environment Variables
The following environment variables should be set in Render:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
DEBUG=False
SECRET_KEY=your_production_secret_key_here
PORT=10000
```

## Render.com Deployment Steps

### 1. Connect Your Repository
1. Fork or push this code to your GitHub repository
2. Connect your GitHub account to Render.com
3. Create a new "Web Service" in Render

### 2. Configure the Web Service

**Basic Settings:**
- **Name:** `real-estate-chatbot` (or any name you prefer)
- **Environment:** `Python 3`
- **Build Command:** `cd backend && pip install -r requirements.txt`
- **Start Command:** `cd backend && python manage.py collectstatic --noinput && python manage.py migrate && python manage.py runserver 0.0.0.0:$PORT`

**Advanced Settings:**
- **Root Directory:** Leave empty (use repository root)
- **Auto-Deploy:** Yes

### 3. Set Environment Variables

In the Render dashboard, under "Environment Variables", add:

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | Your actual Gemini API key |
| `DEBUG` | `False` |
| `SECRET_KEY` | Generate a secure Django secret key |
| `ALLOWED_HOSTS` | Your Render domain (optional, already configured in code) |

To generate a Django secret key, you can use:
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

### 4. Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Monitor the deployment logs for any issues

## Expected Deployment Process

The deployment will:
1. ✅ Clone your repository
2. ✅ Install Python 3.13.4
3. ✅ Install dependencies from requirements.txt
4. ✅ Collect static files with `collectstatic`
5. ✅ Run database migrations
6. ✅ Start the Django server on the correct port

## Troubleshooting

### Common Issues and Solutions

1. **"Invalid HTTP_HOST header" Error**
   - ✅ **Fixed**: The ALLOWED_HOSTS setting now includes Render domains

2. **Static Files Not Loading**
   - ✅ **Fixed**: WhiteNoise middleware added for static file serving

3. **CORS Issues**
   - ✅ **Fixed**: CORS properly configured for production

4. **Missing Environment Variables**
   - Make sure to set all required environment variables in Render dashboard
   - Especially `GEMINI_API_KEY` for the AI functionality to work

5. **Database Issues**
   - The app uses SQLite which works fine for this demo
   - Database file is created automatically during deployment

## Frontend Deployment (Optional)

If you want to deploy the React frontend separately:

1. Create another Web Service in Render for the frontend
2. Set build command: `cd frontend/realestate-ui && npm install && npm run build`
3. Set start command: `cd frontend/realestate-ui && npm run preview -- --host 0.0.0.0 --port $PORT`
4. Update the API base URL in `frontend/realestate-ui/src/api.js` to point to your backend service

## Testing the Deployment

Once deployed successfully:

1. Visit your Render service URL
2. The Django admin should be accessible at `/admin/`
3. Test the API endpoint at `/api/analyze/` with a POST request
4. Check that the Excel data is loaded (look for logs showing "Excel loaded with shape")

## Production Considerations

For a production deployment, consider:

1. **Database**: Use PostgreSQL instead of SQLite
2. **Media Files**: Use cloud storage (AWS S3, etc.) for file uploads
3. **Caching**: Add Redis for better performance
4. **Monitoring**: Set up application monitoring and logging
5. **SSL**: Render provides SSL automatically
6. **CDN**: Consider using a CDN for static files

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key for AI functionality | Yes | None |
| `DEBUG` | Enable/disable debug mode | No | `False` |
| `SECRET_KEY` | Django secret key for security | Recommended | Built-in fallback |
| `ALLOWED_HOSTS` | Additional allowed hosts | No | Render domains included |
| `PORT` | Server port | No | Set by Render |

The application should now deploy successfully on Render.com without the previous HTTP_HOST header errors.