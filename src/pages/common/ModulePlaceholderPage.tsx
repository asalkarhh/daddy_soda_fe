import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface ModulePlaceholderPageProps {
  title: string;
  description?: string;
  category?: string;
}

export const ModulePlaceholderPage: React.FC<ModulePlaceholderPageProps> = ({
  title,
  description = 'This business module is scheduled for development in the upcoming phase.',
  category = 'Under Construction',
}) => {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        subtitle={description}
        badge={
          <Badge variant="warning" size="sm">
            Coming Next
          </Badge>
        }
      />

      <Card className="border-dashed border-2 border-slate-300 bg-white/80">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4 border border-brand-100 shadow-sm">
            <Sparkles className="w-7 h-7" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 mb-1">
            {category}
          </span>

          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Module coming next
          </h3>

          <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
            The full feature set, data tables, actions, and reports for{' '}
            <strong className="text-slate-700 font-semibold">{title}</strong> will be built in the next module iteration.
          </p>

          <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
            <span>Daddy Soda House Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Next Release</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModulePlaceholderPage;
