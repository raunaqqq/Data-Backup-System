$ = jQuery = require('jquery');
Bootstrap = require('bootstrap');
const url = require('url');
const path = require('path');
const {dialog} = require('electron').remote;
const customTitlebar = require('custom-electron-titlebar');
let DataFrame = require('dataframe-js').DataFrame;
let exec = require('child_process').exec;
let fs = require('fs');
let brand,technology,drive_name,dataRead,selectedDrive,driveState,numberOfTar,myTreeList;

$(document).ready(function(){
    const titleBar = new customTitlebar.Titlebar({backgroundColor: customTitlebar.Color.fromHex('#444'),menu:null,
        icon: './web/ongcpic.png'
    });
    console.log(__dirname);
    titleBar.setHorizontalAlignment('left');
    $(document).keydown((e)=>{
        if(e.key == "r" ){
            $('#modalText').html('Made with &#x2665');
            $("#errorModal").modal('show');
        }
    })
    $('#card1').slideToggle(300);
    $("#card1_button .rotate").toggleClass("down");
    createDrivesBackend();
    card1();  
    card2();
});
function createDrivesBackend(){
    console.log(path.join(__dirname,'lsscsimy.txt'));
    DataFrame.fromText(url.format({pathname: path.join(path.resolve(__dirname,'lsscsimy.txt')),
    protocol: 'File',
    slashes: false}),'\t',false).then(function(df){
        brand = df.toArray('2');
        technology = df.toArray('3');
        drive_name = df.toArray('5');
        dataRead = true;
    }).catch(function(err){
        $('#modalText').html('Could not read list of drives. Please try again later.');
        $("#errorModal").modal('show');
        dataRead = false;
    }).finally(function(){
        dataRead = true;
        if(dataRead == true){
            createDrives();
            getSelectedDrive();
            driveState = 'free';
            if (driveState == 'free'){
                $('#card1').slideToggle(300);
                $("#card1_button .rotate").toggleClass("down");
                $('#card2').slideToggle(300);
                $("#card2_button .rotate").toggleClass("down");
                checkNoOfTarFiles();
            }
        }
       
    })
}

function card1(){
    $("#card1_button").click(function(){
        $('#card1').slideToggle(300);
        $("#card1_button .rotate").toggleClass("down");    
       
    });
}
function card2(){
    $("#card2_button").click(function(){
        $('#card2').slideToggle(300);
        $("#card2_button .rotate").toggleClass("down");    
       
    });
}
function checkNoOfTarFiles(){
    $('#tarFileButton').click(function(){
        numberOfTar = parseInt($('#noOfTarFiles').val());
        console.log(numberOfTar);
        if(isNaN(numberOfTar) || numberOfTar<=0){
            $('#modalText').html('Please enter a positive integer value');
            $("#errorModal").modal('show');
        }
        else{
            createTabs(numberOfTar);
        }
    });
}
function createTabs(numberOfTar){
    myTreeList = [];
    for(i=0;i<numberOfTar;i++)
        myTreeList.push([]);
    console.log(myTreeList);
    $('#tabs').empty();
    $('#tabContent').empty()
    createNav = document.createElement('nav');
    createNav.setAttribute('class',"nav nav-tabs");
    createNav.setAttribute('role',"tablist");
    for(i=0;i<numberOfTar;i++){
        createEachTab = document.createElement('div');
        tab = document.createElement('a');
        createEachTab.setAttribute('role',"tabpanel")
        createEachTab.setAttribute('id',"tab"+String(i+1));
        if (i==0){
            createEachTab.setAttribute('class',"tab-pane active")
            tab.setAttribute('class',"nav-item nav-link");
        }
        else{
            createEachTab.setAttribute('class',"tab-pane")
            tab.setAttribute('class',"nav-item nav-link");
        } 
        tab.setAttribute('href',"#tab"+String(i+1));
        tab.setAttribute('role',"tab");
        tab.setAttribute('data-toggle',"tab");
        tab.innerHTML = 'Tar '+String(i+1);
        createEachTab.innerHTML = "<a href=\"#\" class=\"add btn btn-primary\"><i class=\"fas fa-folder-plus\"></i>Add Content</a>";
        createEachTab.innerHTML += "<a href=\"#\" class=\"remove btn btn-primary\"><i class=\"fas fa-folder-minus\"></i>Remove Content</a>";
        createEachTab.innerHTML += '<div class="list-group"></div>';
        createNav.append(tab); 
        $('#tabContent').append(createEachTab);
    }
    $('#tabs').append(createNav);
    $('.add').click(function(){
        dialog.showOpenDialog({properties:["multiSelections","openDirectory","openFile"]},function(files){
        if(files!=undefined){
            index = $('div.active').attr('id').indexOf('b');
            listno = $('div.active').attr('id').substring(index+1);
            listno = parseInt(listno);
            console.log(listno);
            myTreeList[listno-1].push(...files);
            selectedTab = $('div .active').attr('id');
            total_list = '';
            myTreeList[listno-1].forEach(function(element){
                total_list += '<a href="#" class="list-group-item list-group-item-action">'+element+"</a>"
            });
            new_index = $('div.active div.list-group');
            new_index.html(total_list);
            console.log($('.list-group').html());
            console.log(myTreeList);
            console.log($('div.active').html());
        }
    });
    });
    $('.remove').click(function(){
        index = $('div.active').attr('id').indexOf('b');
        listno = $('div.active').attr('id').substring(index+1);
        listno = parseInt(listno);
        myTreeList[listno-1] = [];
        $('div.active div').empty();
        console.log(myTreeList);
    });
    backupData();
}
function backupData(){
    $('#backup_button').click(function(){
        let empty = false;
        myTreeList.forEach(function(tree){
            if (tree.length == 0)
            {
                empty = true;
                $('#modalText').html('Please select files to backup in all the tabs or reduce the number of TAR Files');
                $("#errorModal").modal('show');
            }
        });
        if (empty == false){
            myTreeList.forEach(function(tree){
                let curFiles = ''
                    tree.forEach(function(select){
                        curFiles += ' '+String(select);
                    });
                console.log(curFiles);
                exec(`gtar -cvf ${selectedDrive} ${curFiles}`,function(err,stdout){
                        if(err){
                            error_backup = true;
                            $('#modalText').html('There was an error backing up data');
                            $("#errorModal").modal('show');
                
                        }
                        else{
                            console.log(stdout);
                        }
                    });        
            });       
            if(typeof error_backup === undefined){
                generateLogs();
            }
            
        }   
    });
}
function generateLogs(){
    let i = 1;
    dialog.showOpenDialog({title:'Choose Directory for Logs',properties:['openDirectory']},function(dir){
        if(dir != undefined){
            myTreeList.forEach(function(file){
                my_list = '';
                file.forEach(function(one){
                    my_list += one + '\n';
                });
                fs.writeFileSync(dir+"\\"+String(Date.now()+"_"+String(i))+".txt",my_list);
                i++;
            });
        }
    });
    verifyLogs();
}
function verifyLogs(){
    exec(`mt -f ${selectedDrive} rewind`,function(err,stdout){
        if(err){
            error_backup = true;
            $('#modalText').html('There was an error rewinding data');
            $("#errorModal").modal('show');

        }
        else{
            exec(`mt -f ${selectedDrive} stat`,function(err,stdout){
                if(err){
                    console.log(err);
                    driveState = 'error';
                    $('#modalText').html('Cannot execute command to check state of drive. Please restart the application.');
                    $("#errorModal").modal('show');
                }
                else{
                    if (stdout.startsWith('/')){
                        driveState = 'busy';
                        $('#modalText').html('The selected drive is busy right now. Cannot verify logs.');
                        $("#errorModal").modal('show');
                    }
                    else{
                        let file_no = stdout.split('\n')[1].charAt(12);
                        if (file_no == 0 || file_no == -1){
                            driveState = 'free';
                            for(i=0;i<numberOfTar;i++){
                                exec(`gtar -tvf ${selectedDrive}`,(err,stdout)=>{
                                    if(err){
                                        error = true;
                                        $('#modalText').html('The selected drive is busy right now. Cannot verify logs.');
                                        $("#errorModal").modal('show');
                                    }
                                    else{
                                        myTreeList[i].forEach((value)=>{
                                            check += path.basename(String(value)) + ' ';
                                        });
                                        listout = stdout.split('\n')
                                        listout.forEach((ele)=>{
                                            ele = ele.substring(52,).split('/');
                                            ele = ele[ele.length-1];
                                            output += ele + ' ';
                                        });
                                        if (check!=output){
                                            match = false;
                                        }
                                        else{
                                            check = '';
                                        }
                                        output = '';
                                    }
                                });
                               if (typeof error == undefined && typeof match == undefined){
                                    continue;
                               } 
                               else{
                                $('#modalText').html('There was an error verifying logs');
                                $("#errorModal").modal('show');
                                break;
                               }
                            }
                        }
                        else{
                            driveState = 'busy';
                            $('#modalText').html('The selected drive is busy right now. Cannot verify logs.');
                            $("#errorModal").modal('show');
                        }
                        
                    }
                }
    
            });
        }
    });      
}
function createDrives(){
    let driveList = $('#drive_list');
    let driveForm = document.createElement("form")
    driveForm.setAttribute('name',"drive_form");
    driveForm.setAttribute('id',"drive_form");
    driveList.append(driveForm);
    for(i=0;i<brand.length;i++){
        let label = document.createElement("label");
        let radio = document.createElement("input");
        label.setAttribute('for',"r"+String(i));
        label.setAttribute('id',String(i))
        radio.setAttribute('type',"radio");
        radio.setAttribute('id',"r"+String(i));
        radio.setAttribute('name',"group");
        radio.setAttribute('value',drive_name[i]);
        if(i == 0)
            radio.setAttribute('checked',true);
        label.append(radio);
        label.innerHTML += (brand[i] + ' ' + technology[i] + ' ' + drive_name[i]) ;
        $('#drive_form').append(label);
    }
    $('label').after("<br/>");
}
function getSelectedDrive(){
    $('#drive_sel_button').click(function(){
        selectedDrive = $("input[name='group']:checked").val();
        console.log(selectedDrive);
        exec(`mt -f ${selectedDrive} stat`,function(err,stdout){
            if(err){
                console.log(err);
                driveState = 'error';
                $('#modalText').html('Cannot execute command to check state of drive. Please restart the application.');
                $("#errorModal").modal('show');
            }
            else{
                if (stdout.startsWith('/')){
                    driveState = 'busy';
                    $('#modalText').html('The selected drive is busy right now. Please select a different drive or try again after some time.');
                    $("#errorModal").modal('show');
                }
                else{
                    let file_no = stdout.split('\n')[1].charAt(12);
                    if (file_no == 0 || file_no == -1){
                        driveState = 'free';
                    }
                    else{
                        driveState = 'busy';
                        $('#modalText').html('The selected drive is busy right now. Please select a different drive or try again after some time.');
                        $("#errorModal").modal('show');
                    }
                    
                }
            }

        })
    })
}


