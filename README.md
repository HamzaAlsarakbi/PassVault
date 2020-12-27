# PassVault
A simple program that stores your passwords, locally, and encrypted. Unlike other solutions that store them on someone else's computer.


## Features
### Add Menu
Add email/username and password.

![](https://github.com/Electr0d/PassVault/blob/master/gifs/add%20menu/add%20menu.gif)

Open the add menu by clicking on the "+" sign, or press **Alt + A**
- Type

What do you use the username/email for? Personal uses? School? Work?

- Service

What is the service that provides your with the username/email? Reddit? Facebook?

- Email

Your email or username.

- Password

The secret.


### Table
This is the heart of your vault. Where your passwords lie. You can:

- Copy cells

Want to quickly copy something? Just click on a cell, and its in your clipboard.

![](https://github.com/Electr0d/PassVault/blob/master/gifs/table/copy.gif)

- Edit rows

changed a password? You can change it here too!

![](https://github.com/Electr0d/PassVault/blob/master/gifs/table/editRow.gif)

- Delete rows

Want to delete a row? Click on the trashcan icon, and it's gone... forever (if you save your changes).

![](https://github.com/Electr0d/PassVault/blob/master/gifs/table/deleteRow.gif)

- Strength meter

PassVault tells you how strong a password is. Having upper and lower case characteres, numbers, as well as special characters make it stronger.

![](https://github.com/Electr0d/PassVault/blob/master/gifs/table/strengthMeter.gif)

- Save

Everytime you add something, a save button will appear to asking you to confirm your changes. Click on that button to confirm your changes, or press **Ctrl + S**

![](https://github.com/Electr0d/PassVault/blob/master/gifs/table/save.gif)

- Service icons

To make scrolling through rows looking for something even easier, I added a service icon. With support for 70+ services. To add your own icons. Click the "open icons folder" button in the settings menu.

![](https://github.com/Electr0d/PassVault/blob/master/gifs/table/icons.gif)

### Search & Filters

Have a ton of rows and want to get to one quickly? The search bar is for you. Just click on the magnifier icon, or press **Ctrl + F** to open the search bar.
Every cell checked if it includes your keyword. You can check what columns is searched by in the filter menu, which you can open by clicking on the filter icon, or by pressing **Alt + F**

![](https://github.com/Electr0d/PassVault/blob/master/gifs/search%20bar/search.gif)

For example, if you have only "service" checked and type "Google", then the program lists every row that contains "Google" in the service column.

### Settings Menu
This is where you tweak your vault. You can open the settings menu by clicking on the gear icon, or pressing **Alt + S**

![](https://github.com/Electr0d/PassVault/blob/master/gifs/settings/settings.gif)

- Show Gridlines

This shows border around every row. It is off by default.

- Animations

Animations are enabled by default. This can be switched off.

- Inactivity timeout

After the set amount of minutes (2 by default) you will be prompted by either closing PassVault or closing the prompt. After 1 minute of inactivity. You will be sent back to the login screen.

- Open icons folder

An ease way to drag and drop your favourite icons!


- Themes

Switch to different themes. Dark mode is the default option.


- Change password

This is where you change the master password you use to enter the vault.



- About

About me!


### Lock Vault

Go back to the login menu.

## Security
### Encryption
PassVault uses AES 256 bits encryption algorithm, meaning that your data is secure.

### Cooldown
When wrong password is entered 5 times. User will be locked out for 5 minutes. The period increases every cooldown


### Timeout
After a set period of time. User will be warned, then sent back to the login menu. The timeout period can be changed in the settings menu.


## Feedback
I built this program on feedback, if you have any. Please file an issue and/or DM me on [Instagram](https://www.instagram.com/hamza__sar).

## Roadmap
New updates/bug fixes can be found [here](https://trello.com/b/6yG9npca/passvault)!
