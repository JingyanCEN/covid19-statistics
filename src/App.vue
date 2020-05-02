<template>
  <div id="app">
    <div id="signin-button" class="g-signin2" data-onsuccess="onSignIn"></div>
    <h1 class="title">Latest Situation of Coronavirus Disease (COVID-19)</h1>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue' 

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  mounted() {
    var auth2;

/**
 * Initializes the Sign-In client.
 */
var initClient = function() {
    gapi.load('auth2', function(){
            /**
             * Retrieve the singleton for the GoogleAuth library and set up the
             * client.
             */
            auth2 = gapi.auth2.init({
                client_id: '550594607568-obplj6pk49sp1rb1euo64jjap0blr2kb.apps.googleusercontent.com'
            });

            // Attach the click handler to the sign-in button
            auth2.attachClickHandler('signin-button', {}, onSuccess, onFailure);
        });
    };

    /**
     * Handle successful sign-ins.
     */
    var onSuccess = function(user) {
        console.log('Signed in as ' + user.getBasicProfile().getName());
    };

    /**
     * Handle sign-in failures.
     */
    var onFailure = function(error) {
        console.log(error);
    };
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #10aeb5;
  padding: 1px;
}
.title {
  color: white;
}
.g-signin2{
  margin-top: 45px;
}
.abcRioButton{
  margin: auto;
}
</style>
