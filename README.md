# Swivl Challenge

### Setup
```sh
git clone https://github.com/msolorio/swivl_challenge.git
cd swivl_challenge
make build
make dev
```

### Test API
Once the server is running on port 3000 you can start sending requests to it.
```sh
curl http://localhost:3000/api/locations/4?variables=PhoneNumber,BrandName
```

Run tests
```sh
make test
```
