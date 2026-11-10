/** Keep stored model paths portable between a root site and GitHub project Pages. */
export function publicAssetPath(path:string,base=(import.meta as unknown as {env:{BASE_URL?:string}}).env.BASE_URL||'/'){
 if(!path.startsWith('/assets/'))return path;
 return (base.endsWith('/')?base:base+'/')+path.slice(1);
}
