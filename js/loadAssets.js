export class LoadAssets {
    constructor(callback) {
       this.callback = callback;

       this.loadAll();
    }

    fetchData(url){
        return fetch(url)
        .then((response)=>{
            return response.json();
        })
        .catch((error)=>{
            throw new Error(error);
        })
    }
    loadImages(){
        return new Promise((resolve,reject)=>{
            this.fetchData('js/data/imagesData.json')
            .then((data)=>{
                const keys = Object.keys(data);
                const length = keys.length;
                let loadCount = 0;
                let images = {};

                keys.forEach((key)=>{
                    const img = new Image();
                    img.src = data[key];
                    images[key] = img;

                    img.onload = () =>{
                        loadCount++;
                        if(loadCount === length){
                            resolve(images);
                        }
                    };

                    img.onerror = () =>{
                        reject(new Error(`Image failed to load ${data[key]}`));
                    }
                        
                });
            })
            .catch((error)=>{
                throw new Error(error);
            })
        });
    }
    loadAll(){
        const imagesPromise = this.loadImages();
        const entitiesPromise = this.fetchData('js/data/entitiesData.json');

        Promise.all([imagesPromise,entitiesPromise])
        .then(([imagesData,entitiesData])=>{
            const resources = {
                imagesData: imagesData,
                entitiesData:entitiesData
            }
            this.callback(resources);
        })
        .catch((error)=>{
            throw new Error(error);
        })
    }
}
