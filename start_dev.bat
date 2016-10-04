cmd /c npm install 
@start cmd /c gulp webpack:watch
@start cmd /c gulp database
timeout 2
@start cmd /c gulp server