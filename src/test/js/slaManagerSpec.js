/* global SLAManager, UI, Utils, console */

describe("SLAManager module", function () {
    "use strict";

    var slaManager;
    var BASE_URL;

    beforeAll(function () {
        window.MashupPlatform = new MockMP.MockMP();
        window.UI = jasmine.createSpyObj("UI", ["createTable", "displayData", "clearTable"]);
        window.Utils = jasmine.createSpyObj("Utils", ["createAlert", "getDisplayableConditions", "formatDate", "isEmpty"]);
        BASE_URL = "http://private-anon-c19d8c469-slamanagercore.apiary-mock.com";
        // BASE_URL = "http://130.206.113.159/sla-service";
    });

    beforeEach(function () {
        slaManager = new SLAManager();

        // Load fixtures
        jasmine.getFixtures().fixturesPath = 'base/src/test/fixtures/html';
        loadFixtures('defaultTemplate.html');
    });

    afterEach(function () {
        MashupPlatform.reset();
        jasmine.resetAll(UI);
        jasmine.resetAll(Utils);
    });

    it("should initialize the data table and request the agreements", function () {

        slaManager.init();

        expect(MashupPlatform.http.makeRequest).toHaveBeenCalledWith(BASE_URL + "/agreements", jasmine.any(Object));
        expect(UI.createTable).toHaveBeenCalledWith(slaManager.getAgreements, slaManager.createAgreement);
    });

    it("should get a list of agreements", function () {

        slaManager.getAgreements();

        expect(MashupPlatform.http.makeRequest).toHaveBeenCalledWith(BASE_URL + "/agreements", jasmine.any(Object));
    });

    it("should display the received data when a getAgreements request is successful", function () {

        var autoRefresh = true;
        var response = {
            responseText: "{}"
        };

        slaManager.getAgreements(autoRefresh);
        var successCb = MashupPlatform.http.makeRequest.calls.mostRecent().args[1].onSuccess;
        successCb(response);

        expect(UI.displayData).toHaveBeenCalledWith(slaManager.getAgreementStatus, slaManager.getAgreements, autoRefresh, {});
    });

    it("should handle errors when getting a list of agreements", function () {
        
        var autoRefresh = true;
        var error = {
            body: "body",
            message: "message"
        };

        spyOn(console, "log");
        slaManager.getAgreements(autoRefresh);
        var failureCb = MashupPlatform.http.makeRequest.calls.mostRecent().args[1].onFailure;
        failureCb(error);

        expect(Utils.createAlert).toHaveBeenCalledWith("danger", error.message, error.body, error);
        expect(console.log).toHaveBeenCalledWith("Error: " + JSON.stringify(error));
    });

    it("should get the status of an agreeement", function () {

        var agreementId = "12345";

        slaManager.getAgreementStatus(agreementId);

        expect(MashupPlatform.http.makeRequest).toHaveBeenCalledWith(
            BASE_URL + "/agreements/" + agreementId + "/guaranteestatus",
            jasmine.any(Object));
    });

    it("should call the callback function when the request is successful", function () {

        var agreementId = "12345";
        var success = jasmine.createSpy('success');

        slaManager.getAgreementStatus(agreementId, success);
        var successCb = MashupPlatform.http.makeRequest.calls.mostRecent().args[1].onSuccess;
        successCb();

        expect(success).toHaveBeenCalled();
    });

    it("should handle errors when getting the status of an agreement", function () {

        var agreementId = "12345";
        var error = {
            body: "body",
            message: "message"
        };

        spyOn(console, "log");
        slaManager.getAgreementStatus(agreementId);
        var errorCb = MashupPlatform.http.makeRequest.calls.mostRecent().args[1].onFailure;
        errorCb(error);

        expect(Utils.createAlert).toHaveBeenCalledWith("danger", error.message, error.body, error);
        expect(console.log).toHaveBeenCalledWith("Error: " + JSON.stringify(error));
    });

    it("should create an agreement", function () {
        
        slaManager.createAgreement();

        expect(MashupPlatform.http.makeRequest).toHaveBeenCalledWith(BASE_URL + "/agreements", jasmine.any(Object));
    });

    it("should refresh the table after creating an image", function () {

        slaManager.createAgreement();
        var successCb = MashupPlatform.http.makeRequest.calls.mostRecent().args[1].onSuccess;
        successCb();

        // It should have been called twice, first the POST and then the GET in the request
        expect(MashupPlatform.http.makeRequest.calls.count()).toEqual(2);
        expect(MashupPlatform.http.makeRequest).toHaveBeenCalledWith(BASE_URL + "/agreements", jasmine.any(Object));
    });

    it("should handle errors when creating an agreement", function () {

        var error = {
            body: "body",
            message: "message"
        };

        spyOn(console, "log");
        slaManager.createAgreement();
        var errorCb = MashupPlatform.http.makeRequest.calls.mostRecent().args[1].onFailure;
        errorCb(error);

        expect(Utils.createAlert).toHaveBeenCalledWith("danger", error.message, error.body, error);
        expect(console.log).toHaveBeenCalledWith("Error: " + JSON.stringify(error));
    });

    it("should create an agreement with parameters obtained from a specific form", function () {

        var form = $('#create_agreement_form');
        $('input[name=name]', form).val("Name1");
        $('input[name=template-name]', form).val("Template1");

        var options = {
            onSuccess: jasmine.any(Function),
            onFailure: jasmine.any(Function),
            requestHeaders: jasmine.any(Object),
            method: "POST",
            postBody: {
                "name": $('input[name=name]', form).val(),
                "template-name": $('input[name=template-name]', form).val()
            }
        };

        slaManager.createAgreement();

        expect(MashupPlatform.http.makeRequest).toHaveBeenCalledWith(BASE_URL + "/agreements", options);
    });

    it("should create an agreement without a name", function () {

        var form = $('#create_agreement_form');
        $('input[name=template-name]', form).val("Template1");

        var options = {
            onSuccess: jasmine.any(Function),
            onFailure: jasmine.any(Function),
            requestHeaders: jasmine.any(Object),
            method: "POST",
            postBody: {
                "template-name": $('input[name=template-name]', form).val()
            }
        };

        slaManager.createAgreement();

        expect(MashupPlatform.http.makeRequest).toHaveBeenCalledWith(BASE_URL + "/agreements", options);
    });

    it("should create an agreement without a template name", function () {

        var form = $('#create_agreement_form');
        $('input[name=name]', form).val("Name1");

        var options = {
            onSuccess: jasmine.any(Function),
            onFailure: jasmine.any(Function),
            requestHeaders: jasmine.any(Object),
            method: "POST",
            postBody: {
                "name": $('input[name=name]', form).val()
            }
        };

        slaManager.createAgreement();

        expect(MashupPlatform.http.makeRequest).toHaveBeenCalledWith(BASE_URL + "/agreements", options);
    });

    it("should handle recognized errors", function () {
        
        var autoRefresh = true;
        var error = {
            body: "body",
            message: "500 Error"
        };

        spyOn(console, "log");
        slaManager.getAgreements(autoRefresh);
        var failureCb = MashupPlatform.http.makeRequest.calls.mostRecent().args[1].onFailure;
        failureCb(error);

        expect(Utils.createAlert).toHaveBeenCalledWith("danger", "500 Error", "An error has occurred on the server side.", error);
        expect(console.log).toHaveBeenCalledWith("Error: " + JSON.stringify(error));
    });

    it ("should handle unrecognized errors", function () {
        
        var autoRefresh = true;
        var error = {
            body: "body",
            message: "message"
        };

        spyOn(console, "log");
        slaManager.getAgreements(autoRefresh);
        var failureCb = MashupPlatform.http.makeRequest.calls.mostRecent().args[1].onFailure;
        failureCb(error);

        expect(Utils.createAlert).toHaveBeenCalledWith("danger", error.message, error.body, error);
        expect(console.log).toHaveBeenCalledWith("Error: " + JSON.stringify(error));
    });

    it("should handle an error without a message", function () {

        var autoRefresh = true;
        var error = {
            body: "body"
        };

        spyOn(console, "log");
        slaManager.getAgreements(autoRefresh);
        var failureCb = MashupPlatform.http.makeRequest.calls.mostRecent().args[1].onFailure;
        failureCb(error);

        expect(Utils.createAlert).toHaveBeenCalledWith("danger", "Error", error.body, error);
        expect(console.log).toHaveBeenCalledWith("Error: " + JSON.stringify(error));
    });

    it ("should handle an error with a recognized message, but without a body", function () {
        
        var autoRefresh = true;
        var error = {
            message: "500 Error"
        };

        spyOn(console, "log");
        slaManager.getAgreements(autoRefresh);
        var failureCb = MashupPlatform.http.makeRequest.calls.mostRecent().args[1].onFailure;
        failureCb(error);

        expect(Utils.createAlert).toHaveBeenCalledWith("danger", error.message, "An error has occurred on the server side.", error);
        expect(console.log).toHaveBeenCalledWith("Error: " + JSON.stringify(error));
    });

    it ("should handle an error with an unrecognized message but without a body", function () {
        
        var autoRefresh = true;
        var error = {
            message: "message"
        };

        spyOn(console, "log");
        slaManager.getAgreements(autoRefresh);
        var failureCb = MashupPlatform.http.makeRequest.calls.mostRecent().args[1].onFailure;
        failureCb(error);

        expect(Utils.createAlert).toHaveBeenCalledWith("danger", error.message, "An error has occurred.", error);
        expect(console.log).toHaveBeenCalledWith("Error: " + JSON.stringify(error));
    });

    it ("should handle an empty error", function () {
        
        var autoRefresh = true;
        var error = {};
        Utils.isEmpty.and.returnValue(true);

        spyOn(console, "log");
        slaManager.getAgreements(autoRefresh);
        var failureCb = MashupPlatform.http.makeRequest.calls.mostRecent().args[1].onFailure;
        failureCb(error);

        expect(Utils.createAlert).toHaveBeenCalledWith("danger", "Error", "An error has occurred.", null);
        expect(console.log).toHaveBeenCalledWith("Error: " + JSON.stringify(error));
    });
});