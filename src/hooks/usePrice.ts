import { useRegion } from "@/context/RegionContext";
import { getPrice, type PriceKey } from "@/config/pricing";

export function usePrice(key: PriceKey): string {
  const { region } = useRegion();
  return getPrice(key, region);
}
