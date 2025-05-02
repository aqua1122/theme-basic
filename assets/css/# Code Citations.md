# Code Citations

## License: unknown
https://github.com/actions-marketplace-validations/adshao_chatgpt-code-review-action/tree/de255956f1b8f3bdbbe420b4894cea1d9edec0e6/.github/workflows/publish.yaml

```
: ubuntu-latest

         steps:
         - name: Checkout code
           uses: actions/checkout@v3

         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '16'

         - name: Install dependencies
           run: npm install

         - name:        # filepath: .github/workflows/deploy.yml
        name: Deploy to GitHub Pages
        
        on:
          push:
            branches:
              - main
        
        jobs:
          deploy:
            runs-on: ubuntu-latest
        
            steps:
            - name: Checkout code
              uses: actions/checkout@v3
        
            - name: Setup Node.js
              uses: actions/setup-node@v3
              with:
                node-version: '16'
        
            - name: Install dependencies
              run: npm install
        
            - name: Build project
              run: npm run build
        
            - name: Deploy to GitHub Pages
              uses: peaceiris/actions-gh-pages@v3
              with:
                github_token: ${{ secrets.GITHUB_TOKEN }}
                publish_dir: ./dist                # filepath: .github/workflows/deploy.yml
                name: Deploy to GitHub Pages
                
                on:
                  push:
                    branches:
                      - main
                
                jobs:
                  deploy:
                    runs-on: ubuntu-latest
                
                    steps:
                    - name: Checkout code
                      uses: actions/checkout@v3
                
                    - name: Setup Node.js
                      uses: actions/setup-node@v3
                      with:
                        node-version: '16'
                
                    - name: Install dependencies
                      run: npm install
                
                    - name: Build project
                      run: npm run build
                
                    - name: Deploy to GitHub Pages
                      uses: peaceiris/actions-gh-pages@v3
                      with:
                        github_token: ${{ secrets.GITHUB_TOKEN }}
                        publish_dir: ./dist
```

