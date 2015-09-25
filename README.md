# AwareUI
This is a POC of my work on Environment Aware User Interface. This project mainly consist of:
  - Service
  - Clients
  
##Service
Service is a node project that implemented Web Socket interface and the algorithms to map environment data to visual themes. The visual theme information is send to the user applications via Web Sockets (in push notification manner). Currently the visual theme contains links to theme css and font files, plus metadata of the visual decision. Applications can decide to either apply the visal css and font or use metadata to change the UI (or do both). For more information about how clients can consume the visual information, see the client examples provided in this project.

##Clients
This project also contains various clients to allow the demonstration of working scenario. There are three different clients:
  - Mobile
  - Web
  - NodeJS

##Mobile
Mobile app is under development. Follow these steps to run an application:
  1: Install PhoneGap desktop application. http://docs.phonegap.com/getting-started/1-install-phonegap/desktop/
  2: Install Mobile App. http://docs.phonegap.com/getting-started/2-install-mobile-app/
  3: On PhoneGap desktop add AwareUI/mobile-client as existing project.
  4: Start PhoneGap server.
  5: Access Aware UI application from PhoneGap Mobile App.
  
#RoadMap
This is just the start, we are planning:

- Working Mobile, Web and NodeJS clients.
- Update and Optimize algorithm to map temperature and weather data to a visual decision.
- Improve documentation and add test automation.
- Documentation automation.

#Contribution
If you like this idea and want to contribute, feel free to let me know. 

