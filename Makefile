
.PHONY: clean realclean reset

reset:
	pnpm -r clean
	pnpm install
	pnpm -r build
