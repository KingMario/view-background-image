'use strict';

var downloadIds = [];

chrome.runtime.onInstalled.addListener(
    function createContextItem() {
        chrome.contextMenus.create({
            contexts: ['all'],
            id: 'background_img_save_as',
            title: 'Save background image as ...'
        });
    }
);

chrome.contextMenus.onClicked.addListener(function onContextMenu(info, tab) {
    chrome.tabs.sendMessage(tab.id, '', function onMessageResponse(response) {
        if (!response) {
            return console.error('Failed to find any background image');
        }

        chrome.downloads.download({
            url: response,
            saveAs: true
        }, function(id) {
            downloadIds.push(id);
        });
    });
});

chrome.downloads.onChanged.addListener(function(downloadDelta) {
    if (!downloadDelta.state || downloadDelta.state.current !== 'complete') {
        return;
    }

    var id = downloadDelta.id;
    var downloadIdx = downloadIds.indexOf(id);

    if (downloadIdx > -1) {
        chrome.downloads.erase({
            id: id
        });
        downloadIds.splice(downloadIdx, 1);
    }
});
