<!DOCTYPE html>
<html>
<body>

<h2>Local sessionStorage Object</h2>

<p>A Counter:</p>
<p id="session">0</p>

<p><button onclick="clickCounter()" type="button">Count</button></p>

<p>Click to see the counter increase.</p>
<p>Close the browser tab (or window), and try again, and the counter is reset.</p>


<script>
function clickCounter() {
  if (sessionStorage.clickcount) {
    sessionStorage.clickcount = Number(sessionStorage.clickcount) + 1;
  } else {
    sessionStorage.clickcount = 1;
    }
  document.getElementById("session").innerHTML = sessionStorage.clickcount;
}
</script>

</body>
</html>
