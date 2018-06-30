CPP       = cpp

CPPFLAGS  = -P
CPPFLAGS += -undef -Wundef
CPPFLAGS += -std=c99
CPPFLAGS += -nostdinc
CPPFLAGS += -Wtrigraphs
CPPFLAGS += -fdollars-in-identifiers
CPPFLAGS += -C

JS_DIR    = ./js
JS_MAIN   = $(JS_DIR)/main.js
JS_FILES  = $(shell find $(JS_DIR) -type f -name '*.js')
JS_BUNDLE = www/bundle.js

all: $(JS_BUNDLE)

$(JS_BUNDLE): $(JS_FILES)
	$(CPP) $(CPPFLAGS) $(JS_MAIN) -o $@

.PHONY: clean
clean:
	rm -rf $(JS_BUNDLE)
