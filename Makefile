.DEFAULT_GOAL := run

install_frontend:
	echo "Installing frontend dependencies ..."
	cd frontend && npm install

run_frontend:
	echo "Starting frontend server ..."
	cd frontend && ng serve --host=127.0.0.1 


