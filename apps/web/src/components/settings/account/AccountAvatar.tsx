/* 
  /* <div className="relative">
<Avatar className="h-20 w-20">
  {userProfile?.avatar_url && (
    <AvatarImage
      src={userProfile?.avatar_url}
      alt={userProfile?.full_name || "User"}
    />
  )}
  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
    {userProfile?.full_name
      ?.split(" ")
      .map((name: string) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)}
  </AvatarFallback>
</Avatar>
<Button
  size="sm"
  className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0"
  disabled
  title="Avatar upload coming soon"
>
  <Camera className="h-4 w-4" />
</Button>
</div> */
