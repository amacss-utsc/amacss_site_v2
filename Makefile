# If you're using windows, you need WSL or just run the commands in your terminal
.PHONY: ship

ship:
	@if [ -z "$(msg)" ]; then echo "Commit message is required. Use 'make ship msg=\"your message\"'"; exit 1; fi
	pnpm lint
	git add .
	git commit -m "$(msg)"
	git push
