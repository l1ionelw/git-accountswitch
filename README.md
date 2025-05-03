# Git Account Switch
This Electron app allows you to manage your repositories through multiple GitHub accounts using SSH. With this application, you can easily switch between different accounts, view your repositories, and access commit details without the hassle of logging in and out of GitHub.

### Building the App

To build the Electron app, follow these steps:

1. **Install Dependencies**: Open your terminal and navigate to the project directory. Run the following command to install the necessary dependencies:

   ```bash
   npm install
   ```

2. **Build for Windows**: After the dependencies are installed, you can build the application for Windows by running:

   ```bash
   npm run build:win
   ```
   ## TODO
   - [ ] Detect missing repo (been deleted or moved)
   - [ ] Error propagation
   - [ ] Refactor code
   - [ ] Improve UI
   - [ ] Implement commit and push functionality
   - [ ] Add diff viewer
   - [ ] Enable login with GitHub functionality
