export type BlogPost = {slug:string;title:string;description:string;date:string;category:string;body:string};
/** No user-authored published blog post was provided; empty state is intentional. */
export const blogPosts: BlogPost[] = [];
