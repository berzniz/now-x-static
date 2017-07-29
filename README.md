# now-x-static

Deploy optimized static Single Page Applications using [`now`](https://zeit.co/now)

- Static file serving
- Default route is set to `/index.html`
- Allows to proxy API requests from `/api` to your endpoint to avoid CORS complications
- Optimized cache headers
- Gzip resources
- Customizable by ejecting the configuration

## Install

Globally install:

```bash
$ npm install -g now-x-static
```

## Usage

Deploy current folder:

```bash
$ now-x-static
```

Deploy another folder

```bash
$ now-x-static ./build_folder
```

Deploy with proxy from `/api` to `api.company.com`

```bash
$ now-x-static -a `api.company.com`
```

## How it works

Since "now" has support for Docker, `now-x-static` configures an `Nginx` Dockerfile and deploys it using "now" (You do not need Docker/Nginx installed)

A `Dockerfile` and `default.conf` files are copied to your static folder and are removed after the deploy.


## Proxy API calls

In order to avoid CORS, `now-x-static` can set a proxy from `/api` to an endpoint of your choice:

```bash
$ now-x-static -a https://api.company.com 
```


## Customization

Eject the `Dockerfile` and `default.conf` by running

```bash
$ now-x-static build_folder -e
```

Customize the files and use "now" to deploy
```bash
$ now --docker build_folder
```

### Alternatives

- [`serve`](https://github.com/zeit/serve) uses `node` for static file serving with fallback to index.html

### Is this affiliated or endorsed by zeit.co?

No. This is my personal project, built in the spirit of the now eco-system.

### Who made this?

Tal Bereznitskey. Find me on Twitter as @ketacode at https://twitter.com/ketacode
