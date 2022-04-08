var ViewModel = function () {
    var self = this;
    self.files = ko.observableArray();
    self.detail = ko.observableArray();
    var filesUri = '/files/';
    var detailUri = '/fileDetails/';

    function ajaxHelper(uri, method, data) {
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // alert(errorThrown + JSON.stringify(jqXHR));
            console.log(jqXHR.responseText)
            alert(jqXHR.status + ' - ' + textStatus + ' - please see details in console');
        });
    }
    function getAllFiles() {
        self.files(undefined)
        ajaxHelper(filesUri, 'GET').done(function (data) {
            console.log(data)
            self.files(data);
        });
    }
    self.getDetail = function (item) {
        self.detail(undefined)
        ajaxHelper(detailUri + item.file_id, 'GET').done(function (data) {
            // self.detail(data[0]);
            if(data && data.length>0){
                self.detail(data);    
            }else{
                alert('File processing try after some time')
            }
            
            console.log('self.detail '+ JSON.stringify(self.detail()));
        });
    }
   

    // Fetch the initial data of files.
    getAllFiles();
};$(document).ready(function() {
    // apply bindings here
    ko.applyBindings(new ViewModel());
});