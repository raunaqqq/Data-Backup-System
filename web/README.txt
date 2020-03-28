Data Backup and Logging Interface (ElectronJS)

Electron (formerly known as Atom Shell) is an open-source framework developed and maintained by GitHub. Electron allows for 
the development of desktop GUI applications using web technologies: It combines the Chromium rendering engine and the Node.js 
runtime. Electron is the main GUI framework behind several notable open-source projects including Atom, GitHub Desktop, Light Table, 
Visual Studio Code,and WordPress Desktop.

Electron applications are composed of multiple processes. There is the "browser" process and "renderer" processes, the browser process 
is where your core application logic and window management goes. This process can then launch multiple renderer processes 
which are the windows that actually appear on a user's screen rendering HTML and CSS.
Both the browser and renderer processes can run with Node.js integration if that option is enabled.
Most of Electron's APIs are written in C++ or Objective-C and then exposed directly to your application through JS bindings so 
you can write your entire app in JS.

Directory Structure - 

The Directory mainly consists of the Electron Bindings to run the app. The files for rendering and core functionality of the application
are included under resources/app. It consists of HTML, CSS and JS files and several other utility frameworks like Bootstrap, Font Awesome
to make the interface a step ahead.

Execution - 
To execute the application on your linux system convert the myApp.sh file to an executable and run it. If it still doesn't run, try
using the terminal.

**** Please don't change the locations of any files and folders as the project consists of relative paths to the required files and
directories and changing it might break the functionality of the application ****

Functioning - 

index.html - The HTML file index.html lays out the structure of the application including dynamic addition of elements into the application
based on the user's selection. It includes the files for Bootstrap for the interface, Font Awesome for icons and Jquery for dynamic selection.

style.css - The default Bootstrap styling couldn't provide all the interface elements so the file style.css includes further styling for our
HTML elements.

package.json - This is the configuration file for ElectronJS our framework of choice.

render.js - This JavaScript file consists of the main functioning of the file. It includes functionality to parse the list of drives,
perform selection, backup data, generate logs and verify logs. It does so using the following functions - 

1. createDriveBackend() - This function reads the text file of drives as a tab separated data frame and splits the drive names, technologies
and brands into separate lists for our use. 

2. createDrives() - This creates the front end of the list of drives based on the drives parsed in the createDriveBackend() function. It
includes variable number of radio buttons based on the number of drives.

3. getSelectedDrive() - This function on clicking the Select button gets us the selected drive and checks if the drive is free or busy.
If the drive is busy the data cannot be backed up so i shows a dialog to the user that the data cannot be backed up. Otherwise, 
the use can proceed with the selected drive.

4. checkNoOfTarFiles() - This functions reads the value of the required number of TAR Files and performs basic validation on it to make
sure it's not zero or a negative integer. If it is it will show a dialog to the user.

5. createTabs() - This creates the required number of tabs dynamically by using classes and id's of the HTML file. It also tells
which tab is currently active and provides a button to select the files and folders required to be in the TAR file. After that
it dynamically adds this list to the HTML to show the users's selection for all the different TAR files.

6. backupData() - This function checks if all the TAR files contain selections. If not, it will prompt the user to make a selection
for all the TAR files and then proceed. If the user has made selections in all TAR files it will execute the gtar command to backup data in 
the TAR files naming the TAR file as the timestamp and a number depending on when the backup was made.

7. generateLogs() - This function will generate text logs of the files backed up. It asks the user the directory to create text logs in and
will create a separate log for each TAR file.

8. verifyLogs() - This function will make sure that the logs generated are the same as the list of files which the user selected.

Adding a new drive - 

To add a new drive fill the required fields in the text file under resources/app/web/lsscsimy.txt and the new drive will be parsed
automatically on executing the application next time.