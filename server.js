const http = require('http')
const fs = require('fs')
const qs = require('querystring')

const port = 3000
const ip = '192.168.0.102'

const sendResponse = (filename, statusCode, response) => {
	fs.readFile(`./html/${filename}`, (error, data) => {
		if (error) {
			response.statusCode = 500
			response.setHeader('Content-Type', 'text/plain')
			response.end('Sorry , internal error')
		} else {
			response.statusCode = statusCode
			response.setHeader('Content-Type', 'text/html')
			response.end(data)
		}
	})
}

const server = http.createServer((request, response) => {
	const url = request.url
	const method = request.method

	if (method === 'GET') {
		const requestUrl = new URL(url, `http://${ip}:${port}`)
		console.log(requestUrl.searchParams.get('lang'), 'requestUrl', url)

		if (url === '/') {
			sendResponse('index.html', 200, response)
		} else if (url === '/about.html') {
			sendResponse('about.html', 200, response)
		} else if (url === '/sea.html') {
			sendResponse('sea.html', 200, response)
		} else if (url === '/login.html') {
			sendResponse('login.html', 200, response)
		} else if (url === '/login-success.html') {
			sendResponse('login-success.html', 200, response)
		} else if (url === '/login-fail.html') {
			sendResponse('login-fail.html', 200, response)
		} else {
			sendResponse('404.html', 404, response)
		}
	} else {
		if (url === '/process-login') {
			let body = []
			request.on('data', chunk => {
				body.push(chunk)
			})

			request.on('end', () => {
				body = Buffer.concat(body).toString()
				body = qs.parse(body)
				console.log(body)

				if (body.username === 'sea' && body.password === '123') {
					response.statusCode = 301
					response.setHeader('Location', '/login-success.html')
				} else {
					response.statusCode = 301
					response.setHeader('Location', '/login-fail.html')
				}
				response.end()
			})
		}
	}
})

server.listen(port, ip, () => {
	console.log(`Server is running at http://${ip}:${port}`)
})
