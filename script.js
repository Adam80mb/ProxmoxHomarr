//Update time interval (seconds * 100)
var updateTimeInterval = 30000;

const cpuDisplay = document.querySelector("#cpuDisplay");
const memoryDisplay = document.querySelector("#memoryDisplay");
const usedVmsDisplay = document.querySelector("#usedVmsDisplay");
const totalVmsDisplay = document.querySelector("#totalVmsDisplay");

//Get initial data
getData();

//Get data every x seconds
setInterval(() => {
    getData();
}, updateTimeInterval);

//Get data function
function getData() {
    fetch(`https://pve.afortney.com/api2/json/nodes/${node}/status`, {
        headers: {
            Authorization: "PVEAPIToken=root@pam!homarr=e546afe4-efc0-44a4-a4a7-9a87d563d7b6"
        }
    }).then((res) => {
        return res.json();
    }).then((data) => {
        //CPU usage (percentage)
        cpuDisplay.textContent = `${(data.data.cpu * 100).toFixed(1)}%`;
        if(parseFloat(cpuDisplay.textContent) >= 85) {
            //Red text
            cpuDisplay.setAttribute("class", "red");
        } else {
            //Green text
            cpuDisplay.setAttribute("class", "green");
        }
        //Memory usage (percentage)
        memoryDisplay.textContent = `${((data.data.memory.used / data.data.memory.total) * 100).toFixed(1)}%`;
        if(parseFloat(memoryDisplay.textContent) >= 85) {
            //Red text
            memoryDisplay.setAttribute("class", "red");
        } else {
            //Green text
            memoryDisplay.setAttribute("class", "green");
        }
    });
    fetch(`https://pve.afortney.com/api2/json/nodes/${node}/qemu`, {
        headers: {
            Authorization: "PVEAPIToken=root@pam!homer=381e5b1e-61c1-4025-9e9c-3a61a0ca9900"
        }
    }).then((res) => {
        return res.json();
    }).then((data) => {
        //Number of VMs active and total
        var totalVms = 0;
        var runningVms = 0;
        for(var vm in data.data) {
            totalVms++;
            if(data.data[vm].status === "running") {
                runningVms++;
            }
        }
        usedVmsDisplay.textContent = runningVms;
        totalVmsDisplay.textContent = totalVms;
    });
}
