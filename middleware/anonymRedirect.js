export default function(ctx){
    if (!ctx.$auth.user){
        ctx.redirect('/')
    }
}