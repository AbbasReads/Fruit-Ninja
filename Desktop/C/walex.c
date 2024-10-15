#include <stdio.h>
int main()
{
   char s[101];
   scanf("%s", s);
   int count=0,i=0;
   while(s[i]!='\0')
   {
      if(s[i]>=65 && s[i]<=90)
       count++;
       i++;
   }
   if(count==i)
   {
    for(int j=0;j<i;j++)
    {
        printf("%c", s[j]+32);
    }
   }
   else if (count==i-1)
   {
    if(s[0]>=97 && s[0]<=122)
    {
         for(int j=0;j<i;j++)
    {
      if(j==0)
        printf("%c", s[j]-32);
        else
        printf("%c", s[j]+32);
    }
    }
    else
      printf("%s", s);
   }
   else
   printf("%s", s);
}