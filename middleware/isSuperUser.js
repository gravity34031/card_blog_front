export default function(ctx){
    if(!ctx.$auth.user){
        ctx.redirect('/')
        return false
    }
    if(!ctx.$auth.user.is_superuser){
        ctx.redirect('/')
    }
}