# Create PatelCRM Admin User

Use this command to create your PatelCRM admin account:

```bash
curl -X POST http://localhost:3001/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@patelcrm.com\",\"password\":\"pateladmin123\",\"name\":\"PatelCRM Administrator\"}"
```

Or use this PowerShell command (Windows):

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/create-admin" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"admin@patelcrm.com","password":"pateladmin123","name":"PatelCRM Administrator"}'
```

## Login Credentials

After creating the admin:

- **Email:** admin@patelcrm.com
- **Password:** pateladmin123
- **Login URL:** http://localhost:3001/login

You will automatically be redirected to `/admin/companies` after login.

## Security Note

⚠️ **IMPORTANT:** After creating your admin account, delete the file:
- `/app/api/auth/create-admin/route.ts`

This prevents unauthorized admin account creation in production.

## What You Can Do as PatelCRM Admin

1. ✅ View all customer companies
2. ✅ Add new customer companies
3. ✅ Create admin users for customer companies
4. ✅ Delete customer companies (with all their data)
5. ✅ View subscription status
6. ❌ **Cannot** view or modify customer CRM data (leads, contacts, etc.)
