function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
document.addEventListener("DOMContentLoaded", function() {

  if(getCookie('ttpadisclaimer') == "")
  {
    swal({
      title: 'Disclaimer!',
      text: 'Project Altis is a not-for-profit fanmade parody made under Fair Use. Project Altis is not affiliated with The Walt Disney Company and/or the Disney Interactive Media Group (collectively referred to as "Disney") by continuing to our website you herby agree that you acknowledge this fact.',
      type: 'warning',
      confirmButtonText: 'I agree',
      showCancelButton: true
    }).then(function() {
      setCookie('ttpadisclaimer', '1', 20);
    }, function(dismiss) {
      // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
      if (dismiss === 'cancel') {
        window.location.replace("https://google.com");
      }
    });
  }
});
window.addEventListener("load", function(){
window.cookieconsent.initialise({
  "palette": {
    "popup": {
      "background": "#edeff5",
      "text": "#838391"
    },
    "button": {
      "background": "#4b81e8"
    }
  }
})});


var app = angular.module("projectAltisApp", []);
app.run(function($rootScope) {
    $rootScope.keys = Object.keys;
    console.log("%cPROJECT ALTIS", "font-weight:normal;color:#FFBC09;letter-spacing:1pt;word-spacing:2pt;font-size:69px;text-align:left;font-family:arial, helvetica, sans-serif;line-height:1; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;");
    console.log("Nice to see you there.");
});
app.controller("InvasionCtrl", function($scope, $http, $interval) {
    function getInvasion() {
        $http({
            method: 'GET',
            url: 'https://projectaltis.com/api/invasion'
        }).then(function successCallback(response) {
            $scope.data = response.data;
        }, function errorCallback(response) {
        });
    }
    getInvasion();
    $interval(getInvasion, 10000);
});
app.controller("ToonCtrl", function($scope, $http, $interval, $location, $window) {

    function getToonData() {
        $http({
            method: 'GET',
            url: '/api/hq/toon/' + $location.absUrl().split("/")[5]
        }).then(function successCallback(response) {
            $scope.data = response.data;
            $scope.toon = $scope.data;
            var binaryDNA = ($scope.toon.dna);

            var req = {
             method: 'POST',
             url: '/api/hq/toonimage',
             data: {"dna": binaryDNA}
            }

            $http(req).then(function(resp){
              $scope.toonimage = resp.data.substring(0, resp.data.length - 1);
            });

            $window.document.title = "Project Altis » " + $scope.toon.name + "'s Profile";
        }, function errorCallback(response) {});
    }

    $scope.activetab = 1;
    getToonData();
    $interval(getToonData, 10000);
});
app.controller("GroupCtrl", function($scope, $http, $interval) {
    function getData() {
        $http.get("/api/constants/types").then(function(response) {
            $scope.types = response.data;
        });
        $http.get("/api/constants/zones").then(function(response) {
            $scope.zones = response.data;
        });
    }
    getData();

    function getGroups() {
        $http.get("/api/getgroups").then(function(response) {
            $scope.data = response.data.data;
            angular.forEach($scope.data, function(value, key) {
                if ($scope.id == value.id)
                    $scope.opened = value;
            });
            $scope.open = function(opened) {
                $scope.opened = opened;
                $scope.id = $scope.opened.id;
            }
        });
    }
    getGroups();
    $interval(getGroups, 5000);
});
