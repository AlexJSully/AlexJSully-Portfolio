import ProjectsData from './projectsData.json';

let images = {};

export async function returnImages(which, type) {
    if (Object.keys(images).length < 1) {
        // eslint-disable-next-line no-unused-vars
        for (const [key, value] of Object.entries(ProjectsData)) {
            let thumbnail, screenshot;

            if (["mai-tutor"].includes(key)) {
                // Need to create placeholder
            } else {
                if (["impact-depth", "smalldevtalk"].includes(key)) {
                    thumbnail = await import(`../../../../images/projects/${key}/thumbnail.svg`);
                } else {
                    thumbnail = await import(`../../../../images/projects/${key}/thumbnail.png`);
                };
    
                screenshot = await import(`../../../../images/projects/${key}/screenshot.png`);
            };

            images[key] = {};
            images[key]['thumbnail'] = thumbnail?.default;
            images[key]['screenshot'] = screenshot?.default;
        };
    };

    if (images?.[which.toString()]?.[type.toString()]) {
        return images[which.toString()][type.toString()];
    };
};