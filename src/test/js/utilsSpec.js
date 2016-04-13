/* global Utils */

describe("Utils Module", function () {
    "use strict";

    var agreementsResponse;
    var statusResponse;

    beforeEach(function () {
        jasmine.getJSONFixtures().fixturesPath = 'base/src/test/fixtures/json';
        agreementsResponse = getJSONFixture('agreementsResponse.json');
        statusResponse = getJSONFixture('statusResponse.json');
    });

    afterEach(function () {
        $("body").empty();
    });

    function testIsEmpty(content, result) {
        expect(Utils.isEmpty(content)).toEqual(result);
    }

    it("should hide all previous alerts", function () {

        $('<div>')
            .attr("name", "old")
            .addClass('alert alert-dismissible alert-danger fade in')
            .appendTo('body');
        $('<div>')
            .attr("name", "old")
            .addClass('alert alert-dismissible alert-danger fade in')
            .appendTo('body');
        Utils.createAlert();

        expect('.alert[name=old]').toHaveCss({display: "none"});
    });

    it("should build an alert without details", function () {

        Utils.createAlert("danger", "Error", "An error has occurred.", null);

        expect('body').toContainElement(".alert");
        expect('.alert').not.toContainElement('div');
        expect('.alert').not.toContainElement('a');
    });

    it("should build an alert with details", function () {

        var details = {
            "message": "500 Error",
            "body": "Internal Server Error"
        };

        Utils.createAlert("danger", "Error", "An error has occurred.", details);

        expect('body').toContainElement(".alert");
        expect('.alert').toContainElement('div');
        expect('.alert div').toContainText("500 Error Internal Server Error");
        expect('.alert div').toBeHidden();
        expect('.alert').toContainElement('a');
    });

    it("should toggle the details on click", function () {
        var details = {
            "message": "500 Error",
            "body": "Internal Server Error"
        };

        Utils.createAlert("danger", "Error", "An error has occurred.", details);

        expect(".alert div").toBeHidden();
        $(".alert a").click();
        expect(".alert div").toBeVisible();
    });

    it("should change conditions to a displayable format", function () {

        var conditions = agreementsResponse[0].terms.allTerms.guaranteeTerms;
        var result = Utils.getDisplayableConditions(conditions, status);

        expect(result).toContain('<div class="">percCPULoad < 90%</div>');
        expect(result).toContain('<div class="">percDiskUsed < 80%</div>');
        expect(result).toContain('<div class="">percRAMUsed < 80%</div>');
    });

    it("should label violated conditions through a CSS class", function () {

        var conditions = agreementsResponse[0].terms.allTerms.guaranteeTerms;
        var status = statusResponse.guaranteeterms;
        var result = Utils.getDisplayableConditions(conditions, status);

        expect(result).toContain('<div class="violated">percCPULoad < 90%</div>');
        expect(result).toContain('<div class="fulfilled">percDiskUsed < 80%</div>');
        expect(result).toContain('<div class="fulfilled">percRAMUsed < 80%</div>');
    });

    it("should not add a percentage (%) if 'perc' is not in the condition name", function () {

        var conditions = JSON.parse(JSON.stringify(agreementsResponse[0].terms.allTerms.guaranteeTerms));
        var status = JSON.parse(JSON.stringify(statusResponse.guaranteeterms));
        
        // Change name to remove 'perc'
        conditions[0].serviceLevelObjetive.kpitarget.customServiceLevel = 
            conditions[0].serviceLevelObjetive.kpitarget.customServiceLevel.replace("perc", "");
        conditions[0].name = conditions[0].name.replace("perc", "");
        status[0].name = "CPULoad";

        var result = Utils.getDisplayableConditions(conditions, status);

        expect(result).toContain('<div class="violated">CPULoad < 90</div>');
        expect(result).toContain('<div class="fulfilled">percDiskUsed < 80%</div>');
        expect(result).toContain('<div class="fulfilled">percRAMUsed < 80%</div>');
    });

    it("should format date to UTC format", function () {

        var expected = "Fri, 07 Mar 2014 11:08:24 GMT";
        var result = Utils.formatDate("2014-03-07T11:08:24");

        expect(result).toEqual(expected);
    });

    it("should remove the extra 'CET' from the date", function () {

        var expected = "Fri, 07 Mar 2014 11:08:24 GMT";
        var result = Utils.formatDate("2014-03-07T11:08:24CET");

        expect(result).toEqual(expected);
    });

    it("should return true when passed an empty object", function () {

        testIsEmpty({}, true);
    });

    it("should return true when passed an empty string", function () {

        testIsEmpty("", true);
    });

    it("should return true when passed an empty array", function () {
        testIsEmpty([], true);
    });

    it("should return true when passed null", function () {
        testIsEmpty(null, true);
    });

    it("should return true when passed undefined", function () {
        testIsEmpty(undefined, true);
    });

    it("should return false when passed an object with content", function () {
        testIsEmpty({"k1": "v1"}, false);
    });

    it ("should return false when passed a string with content", function () {
        testIsEmpty("Some content", false);
    });

    it ("should return false when passed an array with content", function () {
        testIsEmpty(["Some", "content"], false);
    });
});