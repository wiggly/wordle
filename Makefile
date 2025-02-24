
.PHONY: clean realclean reset

reset:
	pnpm -r clean
	pnpm install
	pnpm -r build

clean:
	pnpm -r clean

realclean:
	pnpm -r realclean
	rm -rf node_modules
