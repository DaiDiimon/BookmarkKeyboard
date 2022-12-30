window.onload = function () {
	chrome.bookmarks.getTree(function (root) {
		appendSubFolders(root[0]);
	});
}

function appendSubFolders(bookmarkNode) {

	// If this is not a folder, return early

	if (!bookmarkNode.children)
		return;

	// Append children that are folders

	bookmarkNode.children.forEach(child => {
		if (child.children) {
			appendFolder(child);
		}
	});
}

function appendFolder(folder) {

	var div = document.getElementById("bookmarks");

	var folderLink = createFolderLinkElement(folder);
	var dropdown = createDropdownElement(folder);

	var folderDiv = document.createElement("div");
	folderDiv.style.padding = "10px";
	folderDiv.appendChild(folderLink);
	folderDiv.appendChild(dropdown);
	div.appendChild(folderDiv);

	appendSubFolders(folder);
}

function createFolderLinkElement(folder) {

	var link = document.createElement("a");

	link.innerHTML = folder.title;
	link.href = "";

	link.addEventListener("click", openRandomWrapper(folder));

	return link;
}

function createDropdownElement(folder) {

	var select = document.createElement("select");

	select.innerHTML =
		`
		<option value="-1">None</option>
		<option value="0">0</option>
		<option value="1">1</option>
		<option value="2">2</option>
		<option value="3">3</option>
		<option value="4">4</option>
		<option value="5">5</option>
		<option value="6">6</option>
		<option value="7">7</option>
		<option value="8">8</option>
		<option value="9">9</option>
		`;

	// Init dropdown

	chrome.storage.local.get(function (data) {

		var slot = data.folderIds.indexOf(folder.id);
		select.selectedIndex = slot + 1;
	});

	select.style.float = "right";
	select.addEventListener("change", changeSlotWrapper(folder));

	return select;
}

function openRandom(folder) {

	var bgPage = chrome.runtime.getBackgroundPage();
	bgPage.openRandom(folder);
}

function openRandomWrapper(folder) {

	return function () {
		openRandom(folder);
	};
}

function changeSlot(folder, newSlot) {

	chrome.storage.local.get(function (data) {

		var oldSlot = data.folderIds.indexOf(folder.id);

		if (oldSlot == newSlot)
			return;

		// Clear old slot

		if (oldSlot != -1) {

			data.folderIds[oldSlot] = -1;
		}

		// Update new slot

		if (newSlot != -1) {

			data.folderIds[newSlot] = folder.id;
		}

		chrome.storage.local.set(data, () => {
			location.reload();
		});

	});
}

function changeSlotWrapper(folder) {

	return function (event) {
		changeSlot(folder, event.target.value);
	};
}


// function removeRegex(domain_key, regex_index) {
// 	chrome.storage.local.get(function (data) {
// 		data.domains[domain_key].regexes.splice(regex_index, 1);
// 		chrome.storage.local.set(data);
// 	});
// 	location.reload();
// }

// function removeRegexWrapper(domain_key, regex_index) {
// 	return function () {
// 		removeRegex(domain_key, regex_index);
// 	};
// }

// function removeDomain(domain_key) {
// 	chrome.storage.local.get(function (data) {
// 		delete data.domains[domain_key];
// 		chrome.storage.local.set(data);
// 	});
// 	location.reload();
// }

// function removeDomainWrapper(domain_key) {
// 	return function () {
// 		removeDomain(domain_key);
// 	};
// }

// function addRegexRule(domain_key, rule) {
// 	chrome.storage.local.get(function (data) {
// 		data.domains[domain_key].regexes.push(rule);
// 		chrome.storage.local.set(data);
// 	});
// 	location.reload();
// }

// function addRegexRuleWrapper(domain_key, rule) {
// 	return function () {
// 		addRegexRule(domain_key, rule.value);
// 	};
// }

// function setKeyLen(domain_key, inputLen) {
// 	chrome.storage.local.get(function (data) {
// 		data.domains[domain_key].keyLen = inputLen;
// 		chrome.storage.local.set(data);
// 	});
// 	location.reload();
// }

// function setKeyLenWrapper(domain_key, input) {
// 	return function () {
// 		setKeyLen(domain_key, parseInt(input.value));
// 	};
// }


// 	chrome.storage.local.get(function (data) {
// 		var div = document.getElementById("domains");
// 		for (const domain_key in data.domains) {
// 			var domain = data.domains[domain_key];

// 			var domainName = document.createElement("h2")
// 			domainName.innerHTML = domain_key;
// 			div.appendChild(domainName);

// 			var domainButton = document.createElement("button");
// 			domainButton.innerHTML = "Delete";
// 			domainButton.addEventListener("click", removeDomainWrapper(domain_key));
// 			domainName.appendChild(domainButton);

// 			var regexText = document.createElement("h3");
// 			regexText.innerHTML = "Add regex rule: ";
// 			div.appendChild(regexText);

// 			var ruleInput = document.createElement("input");
// 			ruleInput.type = "text";
// 			regexText.appendChild(ruleInput);

// 			var ruleButton = document.createElement("button");
// 			ruleButton.innerHTML = "Add";
// 			ruleButton.addEventListener("click", addRegexRuleWrapper(domain_key, ruleInput));
// 			regexText.appendChild(ruleButton);

// 			// KeyLen setter
// 			var keyText = document.createElement("h3");
// 			keyText.innerHTML = "Set key length: ";
// 			div.appendChild(keyText);

// 			var keyLenInput = document.createElement("input");
// 			keyLenInput.type = "text";
// 			keyLenInput.value = domain.keyLen;
// 			keyText.appendChild(keyLenInput);

// 			var keyLenButton = document.createElement("button");
// 			keyLenButton.innerHTML = "Set Length";
// 			keyLenButton.addEventListener("click", setKeyLenWrapper(domain_key, keyLenInput));
// 			keyText.appendChild(keyLenButton);

// 			// List out all regex
// 			for (var i = 0; i < domain.regexes.length; i++) {
// 				var regex = domain.regexes[i];
// 				var regexButton = document.createElement("button");
// 				regexButton.innerHTML = "Delete: [" + regex + "]";
// 				regexButton.addEventListener("click", removeRegexWrapper(domain_key, i));
// 				div.appendChild(regexButton);
// 			}
// 		}
// 	});

// }