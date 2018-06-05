(function (Storage, undefinded) {

    // Checks to see of storage is supported and available
    // From https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    function storageAvailable(type)
    {
        try {
            var storage = window[type], x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch (e) {
            return e instanceof DOMException &&
                (
                    // everything except Firefox
                    e.code === 22 ||
                    // Firefox
                    e.code === 1014 ||
                    // test name field too, because code might not be present
                    // everything except Firefox
                    e.name === 'QuotaExceededEror' ||
                    // Firefox
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
                ) &&
                // acknowledge QuoteExceededError only if there's something already stored
                storage.length !== 0;
        }
    }

    // Sets value of the data stored at the key if storage is available
    Storage.set = function (key, value) {
        if (storageAvailable('localStorage')) {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        }
        else {
            return false;
        }
    };

    // Gets the value of the data stroed at key if storage is available
    // If the value of the key cannot be retrieved and a default is specified, the default will be used
    // If the storeDefault value is true then the default will also be stored at the key
    Storage.get = function (key, defaultValue, storeDefault) {
        var value = null;

        if (storageAvailable('localStorage')) {
            value = JSON.parse(window.localStorage.getItem(key));
        }

        if (value === null && defaultValue !== undefinded) {
            value = defaultValue;

            if (!!storeDefault) {
                Storage.set(key, value);
            }
        }

        return value;
    }

}(window.Storage = window.Storage || {}));