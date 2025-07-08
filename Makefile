format:
	git add src/
	git status --porcelain src/ | awk '{print $$2}' | xargs npx prettier --write
