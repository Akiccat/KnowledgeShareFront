import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import * as echarts from 'echarts';
import * as htmlToImage from 'html-to-image';
import mapData from '../../../assets/mapdata/100000_full.json';
import {NgxEchartsDirective, provideEcharts} from "ngx-echarts";
import {NoteVisualizationService} from "./note-visualization.service";
import {HttpResult} from "../../../shared/models/http-result.model";

@Component({
  selector: 'app-note-visualization',
  standalone: true,
  imports: [
    NgxEchartsDirective
  ],
  providers: [
    provideEcharts(),
  ],
  templateUrl: './note-visualization.component.html',
  styleUrl: './note-visualization.component.css'
})
export class NoteVisualizationComponent implements OnInit, OnDestroy {
  public barOptions!: {};
  public showLoading = false;
  public routeParam = {
    refresh: null,
    isEditMode: false
  };
  public initBarOpts: any;
  public initBarOpts2: any;
  public mapOption: any;
  public initMapOpts: any;
  public initPieOpts: any;
  public pieOption: any;
  public BarOption2: any;

  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private service: NoteVisualizationService) {
  }

  public ngOnInit(): void {
    this.initMapChart();
    this.initBarChart();
    this.initPieChart();
    this.initBarChart2();
  }

  private initBarChart(): void {
    this.service.getPublishCount().subscribe((result: HttpResult) => {
      this.setBarOption(result.result);
    })
  }

  private initMapChart(): void {
    // @ts-ignore
    echarts.registerMap('china', mapData); // 注册china.json的数据到初始化的echarts对象
    this.service.getUserFrom().subscribe((result: HttpResult) => {
      this.setMapOption(result.result)
    });
  }

  private initPieChart(): void {
    this.service.getReplyCount().subscribe((result: HttpResult) => {
      this.setPieOption(result.result)
    });
  }

  private initBarChart2(): void {
    this.service.getFavouriteCount().subscribe((result: HttpResult) => {
      this.setBarOption2(result.result)
    });

  }

  // tslint:disable-next-line:completed-docs
  public setBarOption(detail: any): void {
    this.initBarOpts = {
      width: 500,
      height: 400
    };
    this.barOptions = {
      title: {
        text: '文章发布数'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: detail.userName,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '发布数',
          type: 'bar',
          barWidth: '60%',
          data: detail.publishCount
        }
      ]
    };
  }

  // tslint:disable-next-line:completed-docs
  public setMapOption(detail: any): void {
    this.initMapOpts = {
      width: 500,
      height: 400
    };
    this.mapOption = {
      title: {
        text: '用户分布'
      },
      tooltip: {},
      visualMap: {
        min: 0,
        max: 20,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'], // 文本，默认为数值文本
        calculable: true
      },
      series: [
        {
          name: '人数',
          type: 'map',
          mapType: 'china',
          roam: true, // 或者 true
          zoom: 1, // 默认缩放比例
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            color: 'red',
            areaColor: '#fff'
          },
          emphasis: {
            itemStyle: {
              areaColor: '#f9ba09'
            }
          },
          data: detail
        }
      ]
    };
  }

  public setPieOption(detail: any): void {
    this.initPieOpts = {
      width: 500,
      height: 400
    };
    this.pieOption = {
      title: {
        text: '回复数量'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: '回复数',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            borderRadius: 10,
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: detail
        }
      ]
    };
  }

  public setBarOption2(detail: any): void {
    this.initBarOpts2 = {
      width: 500,
      height: 400
    };
    this.BarOption2 = {
      title: {
        text: '笔记收藏数排行'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: detail.noteTitle
      },
      series: [
        {
          name: '收藏数',
          type: 'bar',
          data: detail.favouriteCount
        }
      ]
    };
  }

  public ngOnDestroy(): void {
  }
}
