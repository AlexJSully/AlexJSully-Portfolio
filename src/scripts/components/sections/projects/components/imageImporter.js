import ProjectsData from '../projectsData.json';

let images = {};

export async function returnImages(which, type) {
    if (Object.keys(images).length < 1) {
        // eslint-disable-next-line no-unused-vars
        for (const [key, value] of Object.entries(ProjectsData)) {
            let thumbnail;

            try {
                thumbnail = await import(`../../../../../images/projects/${key}/thumbnail.png`);
            } catch(error) {
                // Nothing
            };

            if (!thumbnail) {
                try {
                    thumbnail = await import(`../../../../../images/projects/${key}/thumbnail.svg`);
                } catch(error) {
                    // Nothing
                };
            };

            if (!thumbnail) {
                try {
                    thumbnail = await import(`../../../../../images/projects/${key}/thumbnail.webp`);
                } catch(error) {
                    // Nothing
                };
            };

            images[key] = {};
            images[key]['thumbnail'] = thumbnail?.default;
        };
    };
    
    if (images?.[which.toString()]?.[type.toString()]) {
        return images[which.toString()][type.toString()];
    };
};

let filterImages = {};

export async function returnFilterImages(filterData, which) {
    if (Object.keys(filterImages).length < 1) {
        // eslint-disable-next-line no-unused-vars
        for (const [key, value] of Object.entries(filterData)) {
            for (let i in value) {
                let thumbnail;

                try {
                    thumbnail = await import(`../../../../../images/icons/${value[i]}.svg`);
                } catch(error) {
                    // Nothing
                };
    
                filterImages[value[i]] = thumbnail?.default;
            };
        };
    };
    
    if (filterImages?.[which.toString()]) {
        return filterImages[which.toString()];
    };
};