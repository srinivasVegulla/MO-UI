chmod +x ng_build.sh
npm install -g @angular/cli@1.5.0
npm install
ng build --prod -aot=false --no-progress
