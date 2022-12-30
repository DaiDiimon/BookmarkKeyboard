chrome.runtime.onInstalled.addListener(function (details) {
	initializeDefaultValues();
});

function initializeDefaultValues() {
	chrome.storage.local.get(function (data) {
		if (data.folderIds == undefined) {
			data.folderIds = Array(10).fill(-1);
			chrome.storage.local.set(data);
		}
	});
}

// chrome.tabs.onUpdated.addListener(function (tabId, changedInfo, tab) {

// 	if (changedInfo.status == "loading") {

// 		if (trim(tab.url) == trim(skipURL)) return;
// 		skipURL = "";

// 		var url = new URL(tab.url);
// 		var hostname = url.hostname.replace("www.", "");


// 		chrome.storage.local.get(function (data) {
// 			// Check if hostname is a checked domain

// 			var domain = data.domains[hostname];
// 			if (domain != undefined) {
// 				var block = false;
// 				for (var i = 0; i < domain.regexes.length; i++) {
// 					var regex = new RegExp(domain.regexes[i]);

// 					if (regex.test(url.pathname)) {
// 						block = true;
// 						break;
// 					}
// 				}

// 				if (block) {
// 					chrome.tabs.update(tabId, {
// 						"url": "blocked.html?redirect=" + tab.url
// 					});
// 				}
// 			}
// 		});
// 	} 
// });

chrome.commands.onCommand.addListener((command) => {
	var slot = parseInt(command.replace("slot", ""));

	chrome.storage.local.get(function (data) {
		var folderId = data.folderIds[slot];

		if (folderId) {

			chrome.bookmarks.getSubTree(folderId, function (folder) {
				openRandom(folder[0]);
			});
		}
	});
});

Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
}

function openRandom(folder) {

	var urls = [];
	folder.children.forEach(child => {
		if (child.url) {
			urls.push(child.url);
		}
	});

	if (urls.length == 0)
		return;

	chrome.tabs.update(undefined, {
		url: urls.random()
	});
}