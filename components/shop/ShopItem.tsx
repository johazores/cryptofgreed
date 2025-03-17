import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShopItem as ShopItemType } from '@/context/types';
import { cn } from "@/lib/utils"
import { Zap, Sword, Shield } from 'lucide-react';

interface ShopItemProps {
  item: ShopItemType;
  onBuy: () => void;
  canAfford: boolean;
}

const rarityColors = {
  common: "bg-slate-200 text-slate-700",
  uncommon: "bg-emerald-100 text-emerald-700",
  rare: "bg-blue-100 text-blue-700",
  epic: 'bg-purple-200 text-purple-700',
  legendary: 'bg-amber-200 text-amber-700',
};

const ShopItem: React.FC<ShopItemProps> = ({ item, onBuy, canAfford }) => {
  return (
    <Card className="group relative overflow-hidden rounded-lg border p-4 transition-all hover:scale-105 hover:shadow-lg">
      <CardContent className="relative">
       <div className="mb-2 flex items-center justify-between">
        <h3 className="font-bold">{item.name}</h3>
          <span className={cn("rounded-full px-2 py-1 text-xs font-medium", rarityColors[item.rarity])}>
            {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
          </span>
        </div>

        <p className="mb-3 text-sm text-gray-600">{item.description}</p>
        <div className="flex items-center justify-between">
        {item.type === 'card' && (
                      <div className="flex items-center gap-2">
                        <span className="flex items-center rounded-full bg-purple-100 px-2 py-1 text-sm font-medium text-purple-700">
                          <Zap className="mr-1 h-4 w-4" />
                          {item.energyCost}
                        </span>
                        {item.cardType === "attack" ? (
                          <span className="flex items-center rounded-full bg-red-100 px-2 py-1 text-sm font-medium text-red-700">
                            <Sword className="mr-1 h-4 w-4" />
                            {item.value}
                          </span>
                        ) : (
                          <span className="flex items-center rounded-full bg-blue-100 px-2 py-1 text-sm font-medium text-blue-700">
                            <Shield className="mr-1 h-4 w-4" />
                            {item.value}
                          </span>
                        )}
                      </div>
                      )} 
 
        {item.type === 'potion' && (
          <div className="text-sm">
            <p>Effect: {item.effect}</p>
            <p>Value: {item.value}</p>
          </div>
        )}

        {item.type === 'equipment' && (
          <div className="text-sm">
            <p>Slot: {item.slot}</p>
            <p>
              {item.statBonus.type}: +{item.statBonus.value}
            </p>
          </div>
        )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto border-t border-slate-100 p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <p className="font-medium text-amber-600">{item.cost} Gold</p>
          <Button
            onClick={onBuy}
            disabled={!canAfford}
            variant={canAfford ? 'default' : 'outline'}
            size="sm"
          >
            {canAfford ? 'Buy' : 'Cannot Afford'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ShopItem;
