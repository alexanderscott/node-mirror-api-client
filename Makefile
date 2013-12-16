REPORTER = dot

test: 
	@./node_modules/.bin/mocha \
        --ui bdd \
        --reporter $(REPORTER)

.PHONY: test
