import { Button } from '~/components/atoms/Button';
import { Input } from '~/components/atoms/Input';
import { Label } from '~/components/atoms/Label';
import { Slider } from '~/components/atoms/Slider';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/molecules/Card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/molecules/Tabs';

export function BuySell() {
  return (
    <Tabs defaultValue="spot">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="spot">Spot</TabsTrigger>
        <TabsTrigger value="margin">Cross Margin</TabsTrigger>
      </TabsList>
      <TabsContent value="spot">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Limit Price</Label>
                <Input
                  id="name"
                  defaultValue="222 USDT"
                  className="text-right"
                />
              </div>
              <div className="space-y-2 py-4">
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Quantity</Label>
                <Input
                  id="username"
                  className="text-right"
                  defaultValue="1 ETH"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-positive">Buy ETH</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Limit Price</Label>
                <Input
                  id="name"
                  defaultValue="222 USDT"
                  className="text-right"
                />
              </div>
              <div className="space-y-2 py-4">
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Quantity</Label>
                <Input
                  id="username"
                  className="text-right"
                  defaultValue="1 ETH"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-negative">Sell ETH</Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you&lsquo;ll be logged
              out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
