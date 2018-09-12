var config = {
    apiKey: "AIzaSyBq-780mxH_645pFLvbf7ol5Jf8yE9St-I",
    authDomain: "app-builders-e1ae7.firebaseapp.com",
    databaseURL: "https://app-builders-e1ae7.firebaseio.com",
    projectId: "app-builders-e1ae7",
    storageBucket: "app-builders-e1ae7.appspot.com",
    messagingSenderId: "922713228716"
};
firebase.initializeApp(config);

// save a reference to the firestore database
// to access it in the future
var db = firebase.firestore();

new Vue({
    el: '#speakers',
    data: {
        speakers: []
    },
    mounted: function() {
        this.loadData();
    },
    methods: {
        loadData: function() {
            var self = this;

            db.collection("speakers").where("isStory", "==", false).get().then((speakers) => {
                var result = [];
                var tmp = [];
                speakers.forEach((s) => {
                    if (tmp.length == 4) {
                        result.push(tmp.slice());
                        tmp = [];
                    }
                    tmp.push(s.data());
                });
                result.push(tmp.slice());
                self.speakers = result;
            });

        }
    }
});

new Vue({
    el: '#stories',
    data: {
        speakers: []
    },
    mounted: function() {
        this.loadData();
    },
    methods: {
        loadData: function() {
            var self = this;

            db.collection("speakers").where("isStory", "==", true).get().then((speakers) => {
                var result = [];
                speakers.forEach((s) => {
                    result.push(s.data());
                });
                self.speakers = result;
            });

        }
    }
});

new Vue({
    el: '#schedule',
    data: {
        talks: [],
        speakers: {}
    },
    mounted: function() {
        this.loadData();
    },
    methods: {
        loadData: function() {
            var self = this;

            db.collection("speakers").get().then((speakers) => {
                var spks = {};
                speakers.forEach((s) => {
                    var data = s.data();
                    spks[data["speakerId"]] = data;
                });
                self.speakers = spks;

                db.collection("talks").get().then((talks) => {
                    var result = [[],[],[],[]];
                    talks.forEach((t) => {
                        var data = t.data();
                        data["speakerObj"] = spks[data["speaker"]];
                        if (data["day"] === "Monday 16th") {
                            if(data["room"] === "Firebase Room") {
                                result[0].push(data);
                            } else if (data["room"] === "Secondary") {
                                result[1].push(data);
                            } else {
                                result[0].push(data);
                                result[1].push(data);
                            }
                        } else {
                            if(data["room"] === "Firebase Room") {
                                result[2].push(data);
                            } else if (data["room"] === "Secondary") {
                                result[3].push(data);
                            } else {
                                result[2].push(data);
                                result[3].push(data);
                            }
                        }
                    });

                    var compare = function(a, b) {
                        if (a["time"] > b["time"]) {
                            return 1;
                        } else if (a["time"] < b["time"]) {
                            return -1;
                        } else {
                            return 0;
                        }
                    };

                    result[0].sort(compare);
                    result[1].sort(compare);
                    result[2].sort(compare);
                    result[3].sort(compare);
                    console.log(result);
                    self.talks = result;
                });
            });

        }
    }
});

