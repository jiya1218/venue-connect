import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbSchema, type BreadcrumbItem } from './SchemaMarkup';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** If true, renders the JSON-LD schema alongside the visual breadcrumbs */
  withSchema?: boolean;
}

/**
 * Visual breadcrumb trail + optional BreadcrumbList JSON-LD.
 *
 * Usage:
 *   <Breadcrumbs
 *     withSchema
 *     items={[
 *       { name: 'Ahmedabad', slug: 'venues-in-ahmedabad' },
 *       { name: 'Wedding Venues', slug: 'wedding-venues-in-ahmedabad' },
 *     ]}
 *   />
 */
export function Breadcrumbs({ items, withSchema = true }: BreadcrumbsProps) {
  const allItems = [{ name: 'Home', slug: '' }, ...items];

  return (
    <>
      {withSchema && <BreadcrumbSchema items={items} />}

      <nav
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap gap-1 text-sm text-gray-500"
      >
        {allItems.map((item, idx) => {
          const isLast = idx === allItems.length - 1;

          return (
            <span key={idx} className="flex items-center gap-1">
              {/* Separator */}
              {idx > 0 && (
                <ChevronRight size={13} className="text-gray-300 flex-shrink-0" />
              )}

              {/* Item */}
              {isLast ? (
                <span
                  aria-current="page"
                  className="text-gray-900 font-semibold truncate max-w-[180px]"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.slug ? `/${item.slug}` : '/'}
                  className="hover:text-indigo-600 transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  {idx === 0 && <Home size={13} />}
                  {item.name}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
